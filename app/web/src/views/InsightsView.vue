<script setup lang="ts">
import { onMounted } from 'vue';
import { useFeedbackStore } from '@/stores/feedbackStore';
import InsightTimeline from '@/components/feedback/InsightTimeline.vue';
import { BrainCircuit, Trophy, History } from 'lucide-vue-next';

const feedbackStore = useFeedbackStore();

onMounted(async () => {
  await Promise.all([
    feedbackStore.fetchFeedback(),
    feedbackStore.fetchProgress()
  ]);
});

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-blue-600';
  return 'text-orange-600';
}
</script>

<template>
  <div class="space-y-8 max-w-6xl mx-auto px-4 md:px-0">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <BrainCircuit class="w-8 h-8 text-primary" />
          Behavioral Insights
        </h1>
        <p class="text-slate-500 mt-1">Deep dive into your spending habits and progress.</p>
      </div>

      <div v-if="feedbackStore.currentProgress" class="flex items-center bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
        <div class="flex flex-col items-end mr-4">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Improvement</span>
          <span :class="['text-2xl font-black tabular-nums', getScoreColor(feedbackStore.currentProgress.improvement_score)]">
            {{ feedbackStore.currentProgress.improvement_score }}%
          </span>
        </div>
        <div class="p-3 rounded-xl bg-yellow-50">
          <Trophy class="w-6 h-6 text-yellow-500" />
        </div>
      </div>
    </div>

    <!-- Full History List -->
    <div class="space-y-12">
      <div class="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-200 pb-2">
        <History class="w-5 h-5" />
        <h2>Insight History</h2>
      </div>

      <div v-if="feedbackStore.feedbackHistory.length === 0 && !feedbackStore.loading" class="bg-white rounded-3xl border border-dashed border-slate-300 py-20 flex flex-col items-center text-center">
        <div class="bg-slate-100 p-4 rounded-full mb-4">
          <BrainCircuit class="w-10 h-10 text-slate-300" />
        </div>
        <h3 class="text-xl font-bold text-slate-900">No history yet</h3>
        <p class="text-slate-500 max-w-sm mt-2">
          As you continue tracking your expenses, we'll build a library of personalized advice to help you reach your goals.
        </p>
      </div>

      <div v-else>
        <InsightTimeline 
          :feedback-history="feedbackStore.feedbackHistory"
          :progress-history="feedbackStore.progressHistory"
          @acknowledge="feedbackStore.acknowledgeFeedback"
        />
      </div>
    </div>
  </div>
</template>
