<script setup lang="ts">
import { computed } from 'vue';
import type { FeedbackHistory, UserProgress } from '@/types';
import FeedbackCard from './FeedbackCard.vue';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-vue-next';

const props = defineProps<{
  feedbackHistory: FeedbackHistory[];
  progressHistory: UserProgress[];
}>();

defineEmits<{
  (e: 'acknowledge', id: number): void;
}>();

// Group feedback by week
const groupedFeedback = computed(() => {
  const groups: Record<string, {
    weekStart: string;
    weekEnd: string;
    items: FeedbackHistory[];
    progress?: UserProgress;
  }> = {};

  // Sort feedback by date descending
  const sortedFeedback = [...props.feedbackHistory].sort((a, b) => 
    new Date(b.week_start).getTime() - new Date(a.week_start).getTime()
  );

  sortedFeedback.forEach(item => {
    const key = item.week_start;
    if (!groups[key]) {
      // Find corresponding progress for this week
      const progress = props.progressHistory.find(p => p.week_start === item.week_start);
      
      groups[key] = {
        weekStart: item.week_start,
        weekEnd: item.week_end,
        items: [],
        progress
      };
    }
    groups[key].items.push(item);
  });

  return Object.values(groups);
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getScoreColor(score: number) {
  if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 50) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-orange-100 text-orange-700 border-orange-200';
}

function getScoreIcon(score: number) {
  if (score >= 80) return TrendingUp;
  if (score >= 50) return Minus;
  return TrendingDown;
}

function getStatusText(score: number) {
  if (score >= 80) return 'Exceptional';
  if (score >= 50) return 'Steady';
  return 'needs focus';
}
</script>

<template>
  <div class="relative pb-12">
    <!-- Vertical Line -->
    <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block" />
    <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 md:hidden" />

    <div class="space-y-12">
      <div 
        v-for="group in groupedFeedback" 
        :key="group.weekStart"
        class="relative"
      >
        <!-- Week Marker Node -->
        <div class="flex items-center justify-start md:justify-center mb-6">
          <div class="z-10 bg-white p-1 rounded-full border-4 border-slate-50 shadow-sm">
            <div 
              :class="[
                'w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-col',
                group.progress ? getScoreColor(group.progress.improvement_score) : 'bg-slate-100 text-slate-500'
              ]"
            >
              <template v-if="group.progress">
                <span class="text-xs md:text-sm font-bold leading-none">{{ group.progress.improvement_score }}%</span>
                <component :is="getScoreIcon(group.progress.improvement_score)" class="w-3 h-3 md:w-4 md:h-4 mt-0.5" />
              </template>
              <Calendar v-else class="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          
          <!-- Date Range (Mobile & Desktop positions differ slightly for style) -->
          <div class="ml-4 md:absolute md:left-1/2 md:-translate-x-1/2 md:mt-24 text-center">
            <div class="bg-white px-3 py-1 rounded-full border border-slate-100 shadow-xs inline-flex items-center gap-1.5 whitespace-nowrap">
              <span class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                {{ formatDate(group.weekStart) }} — {{ formatDate(group.weekEnd) }}
              </span>
              <Badge v-if="group.progress" variant="outline" class="h-5 text-[9px] uppercase tracking-tighter border-slate-200">
                {{ getStatusText(group.progress.improvement_score) }}
              </Badge>
            </div>
          </div>
        </div>

        <!-- Insights Grid for this week -->
        <div class="pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-8 mt-12">
          <div 
            v-for="(item, itemIndex) in group.items" 
            :key="item.id"
            :class="[
              'mb-6 md:mb-0',
              itemIndex % 2 === 0 ? 'md:justify-self-end md:text-right' : 'md:justify-self-start'
            ]"
          >
            <div class="max-w-md w-full">
              <FeedbackCard 
                :feedback="item"
                @acknowledge="$emit('acknowledge', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Connector to future points -->
    <div class="absolute left-4 md:left-1/2 bottom-0 w-4 h-4 bg-slate-200 rounded-full -translate-x-1/2 flex items-center justify-center">
      <div class="w-2 h-2 bg-white rounded-full" />
    </div>
  </div>
</template>

<style scoped>
/* Add a subtle fade for the connector line at the top/bottom if needed */
</style>
