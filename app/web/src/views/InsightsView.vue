<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { useFeedbackStore } from '@/stores/feedbackStore';
import InsightTimeline from '@/components/feedback/InsightTimeline.vue';
import ProgressTrendChart from '@/components/charts/ProgressTrendChart.vue';
import { BrainCircuit, Trophy, History, TrendingUp, ChevronUp, Loader2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const feedbackStore = useFeedbackStore();
const showScrollTop = ref(false);
const loadMoreTrigger = ref<HTMLElement | null>(null);

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  // Use the store actions which now trigger Vue Query refetch
  await Promise.all([
    feedbackStore.fetchFeedback(false), // don't force reset, use cache if available
    feedbackStore.fetchProgress()
  ]);

  // Setup intersection observer for infinite scroll
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && feedbackStore.hasMore && !feedbackStore.isFetchingMore) {
      feedbackStore.fetchMoreFeedback();
    }
  }, { threshold: 0.1 });

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }

  // Setup scroll listener for scroll-to-top button
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  window.removeEventListener('scroll', handleScroll);
});

function handleScroll() {
  showScrollTop.value = window.scrollY > 400;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-blue-600';
  return 'text-orange-600';
}
</script>

<template>
  <div class="space-y-8 max-w-6xl mx-auto px-4 md:px-0 pb-20">
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

    <!-- Progress Over Time Chart -->
    <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm overflow-hidden relative">
      <div class="flex items-center gap-2 mb-8">
        <div class="p-2 rounded-lg bg-indigo-50">
          <TrendingUp class="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">Progress Over Time</h2>
          <p class="text-xs text-slate-500">Your behavioral improvement score history</p>
        </div>
      </div>
      
      <div class="h-[300px]">
        <ProgressTrendChart 
          :progress-history="feedbackStore.progressHistory"
          :loading="feedbackStore.loading"
        />
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

        <!-- Infinite Scroll Trigger -->
        <div ref="loadMoreTrigger" class="py-8 flex justify-center">
          <div v-if="feedbackStore.isFetchingMore" class="flex items-center gap-2 text-slate-400">
            <Loader2 class="w-5 h-5 animate-spin" />
            <span>Loading more insights...</span>
          </div>
          <div v-else-if="!feedbackStore.hasMore && feedbackStore.feedbackHistory.length > 0" class="text-slate-400 italic">
            You've reached the end of your history.
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Scroll to Top Button -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-10 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-10 opacity-0"
    >
      <Button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg z-50 p-0"
        aria-label="Scroll to top"
      >
        <ChevronUp class="w-6 h-6" />
      </Button>
    </Transition>
  </div>
</template>
