<script setup lang="ts">
import { onMounted } from 'vue';
import { useFeedbackStore } from '@/stores/feedbackStore';
import FeedbackCard from './FeedbackCard.vue';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, Trophy, Info } from 'lucide-vue-next';

const feedbackStore = useFeedbackStore();

onMounted(async () => {
  await Promise.all([
    feedbackStore.fetchFeedback(),
    feedbackStore.fetchProgress()
  ]);
  
  // If no feedback yet, try evaluating (for demo purposes)
  if (feedbackStore.feedbackHistory.length === 0) {
    await feedbackStore.evaluateRules();
  }
});

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 50) return 'text-teal-600';
  return 'text-amber-600';
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-100/50 flex items-center justify-center text-emerald-700">
            <BrainCircuit class="w-5 h-5" />
        </div>
        <h2 class="text-xl font-serif font-medium text-emerald-950">Behavioral Insights</h2>
      </div>
      
      <div v-if="feedbackStore.currentProgress" class="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-emerald-100/50">
        <div class="flex flex-col items-end mr-3">
          <span class="text-[10px] font-bold text-emerald-900/40 uppercase tracking-wider">Improvement Score</span>
          <span :class="['text-xl font-serif font-medium tabular-nums', getScoreColor(feedbackStore.currentProgress.improvement_score)]">
            {{ feedbackStore.currentProgress.improvement_score }}%
          </span>
        </div>
        <div class="p-2 rounded-lg bg-yellow-50 border border-yellow-100">
          <Trophy class="w-5 h-5 text-yellow-600" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <Card v-if="feedbackStore.feedbackHistory.length === 0 && !feedbackStore.loading" class="border-2 border-dashed border-emerald-100/50 bg-emerald-50/30">
      <CardContent class="py-12 flex flex-col items-center text-center">
        <div class="bg-emerald-100/50 p-4 rounded-full mb-4">
          <Info class="w-8 h-8 text-emerald-400" />
        </div>
        <h3 class="text-lg font-serif text-emerald-950">Establishing Baseline</h3>
        <p class="text-emerald-900/50 max-w-xs mt-2 font-light">
          Keep tracking your transactions. Once we have a week of data, your personalized behavioral insights will appear here.
        </p>
      </CardContent>
    </Card>

    <!-- Feedback Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FeedbackCard 
        v-for="item in feedbackStore.latestFeedback" 
        :key="item.id" 
        :feedback="item"
        @acknowledge="feedbackStore.acknowledgeFeedback"
      />
    </div>
  </div>
</template>
