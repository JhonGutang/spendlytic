<?php

namespace App\Services;

use App\Repositories\FeedbackHistoryRepository;
use App\Repositories\UserProgressRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class FeedbackEngineService
{
    public function __construct(
        private FeedbackHistoryRepository $feedbackHistoryRepository,
        private UserProgressRepository $userProgressRepository
    ) {}

    /**
     * Process evaluation results from RuleEngine and generate feedback.
     */
    public function processRuleResults(array $evaluationResults): array
    {
        $userId = $evaluationResults['user_id'];
        $evaluationDate = Carbon::parse($evaluationResults['evaluation_date']);
        $weekStart = Carbon::parse($evaluationResults['weeks']['current']['start']);
        $weekEnd = Carbon::parse($evaluationResults['weeks']['current']['end']);
        
        $triggeredRules = $evaluationResults['triggered_rules'];
        
        // 1. Get User Progress History
        $history = $this->userProgressRepository->getRecent($userId);
        
        // 2. Determine Feedback Level ('basic' or 'advanced')
        $feedbackLevels = $this->determineFeedbackLevels($triggeredRules, $history);
        
        $generatedFeedback = [];
        $triggeredRuleIds = [];

        // 3. Generate Feedback for each triggered rule
        foreach ($triggeredRules as $ruleResult) {
            $ruleId = $ruleResult['rule_id'];
            $triggeredRuleIds[] = $ruleId;
            $level = $feedbackLevels[$ruleId] ?? 'basic';
            
            $template = FeedbackTemplateLibrary::getTemplate($ruleId, $level);
            
            if ($template) {
                $feedbackData = $this->fillTemplate($template, $ruleResult['data']);
                
                $feedback = $this->feedbackHistoryRepository->updateOrCreate(
                    [
                        'user_id' => $userId,
                        'week_start' => $weekStart->toDateString(),
                        'rule_id' => $ruleId,
                        // For category overspend, differentiate by category name
                        'category_name' => $ruleResult['data']['category'] ?? null,
                    ],
                    [
                        'week_end' => $weekEnd->toDateString(),
                        'template_id' => $template['template_id'],
                        'level' => $level,
                        'explanation' => $feedbackData['explanation'],
                        'suggestion' => $feedbackData['suggestion'],
                        'data' => $ruleResult['data'],
                    ]
                );
                
                // Force timestamp update even if data didn't change
                $feedback->touch();
                
                $generatedFeedback[] = $feedback;
            }
        }

        // 4. Update User Progress for this week
        $allRuleIds = ['category_overspend', 'weekly_spending_spike', 'frequent_small_purchases'];
        $notTriggeredRuleIds = array_diff($allRuleIds, array_unique($triggeredRuleIds));
        
        $improvementScore = $this->calculateImprovementScore($triggeredRuleIds, $history);

        $progress = $this->userProgressRepository->updateOrCreate(
            ['user_id' => $userId, 'week_start' => $weekStart->toDateString()],
            [
                'week_end' => $weekEnd->toDateString(),
                'rules_triggered' => array_unique($triggeredRuleIds),
                'rules_not_triggered' => array_values($notTriggeredRuleIds),
                'improvement_score' => $improvementScore,
            ]
        );

        // Force timestamp update even if data didn't change
        $progress->touch();

        return $generatedFeedback;
    }

    /**
     * Determine if a rule should show 'basic' or 'advanced' feedback.
     */
    private function determineFeedbackLevels(array $triggeredRules, Collection $history): array
    {
        $levels = [];
        
        foreach ($triggeredRules as $rule) {
            $ruleId = $rule['rule_id'];
            
            // Count consecutive weeks this specific rule has triggered
            $consecutiveViolations = 0;
            foreach ($history as $progress) {
                if (in_array($ruleId, $progress->rules_triggered)) {
                    $consecutiveViolations++;
                } else {
                    break;
                }
            }
            
            // Count consecutive weeks this rule has NOT triggered (after being triggered before)
            // For simplicity in MVP, we check if it was absent in recent history
            $consecutiveImprovements = 0;
            foreach ($history as $progress) {
                if (!in_array($ruleId, $progress->rules_triggered)) {
                    $consecutiveImprovements++;
                } else {
                    break;
                }
            }

            if ($consecutiveViolations >= 2) {
                $levels[$ruleId] = 'basic'; // User is struggling
            } elseif ($consecutiveImprovements >= 2) {
                $levels[$ruleId] = 'advanced'; // User is improving
            } else {
                $levels[$ruleId] = 'basic'; // Default
            }
        }
        
        return $levels;
    }

    /**
     * Calculate an improvement score (0-100).
     */
    private function calculateImprovementScore(array $triggeredIds, Collection $history): int
    {
        if ($history->isEmpty()) return 50;

        $score = 50;
        $triggeredCount = count(array_unique($triggeredIds));
        
        // Fewer rules triggered = better score
        $score += (3 - $triggeredCount) * 10;
        
        // Compare with previous week
        $previous = $history->first();
        if ($previous) {
            $prevTriggeredCount = count($previous->rules_triggered);
            if ($triggeredCount < $prevTriggeredCount) {
                $score += 15;
            } elseif ($triggeredCount > $prevTriggeredCount) {
                $score -= 10;
            }
        }

        return (int) max(0, min(100, $score));
    }

    /**
     * Fill template placeholders with actual data.
     */
    private function fillTemplate(array $template, array $data): array
    {
        $explanation = $template['explanation'];
        $suggestion = $template['suggestion'];
        
        foreach ($template['placeholders'] as $placeholder) {
            $value = $data[$placeholder] ?? '';
            
            // Special derivation for target_amount if not in raw data
            if ($placeholder === 'target_amount' && empty($value)) {
                $current = $data['current_week_amount'] ?? $data['current_week_total'] ?? 0;
                $value = (float)$current * 0.9; // Suggest 10% reduction
            }

            // Basic formatting
            if (str_contains($placeholder, 'amount') || str_contains($placeholder, 'total')) {
                $value = '$' . number_format((float)$value, 2);
            } elseif (str_contains($placeholder, 'percentage')) {
                // Templates already have the % sign, so just format the number
                $value = number_format((float)$value, 2);
            }
            
            $explanation = str_replace('${' . $placeholder . '}', $value, $explanation);
            $suggestion = str_replace('${' . $placeholder . '}', $value, $suggestion);
        }
        
        return [
            'explanation' => $explanation,
            'suggestion' => $suggestion,
        ];
    }
}
