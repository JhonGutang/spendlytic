<script setup lang="ts">
import { computed } from 'vue';
import type { FeedbackHistory } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  TrendingUp, 
  Zap, 
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next';

const props = defineProps<{
  feedback: FeedbackHistory;
}>();

const emit = defineEmits<{
  (e: 'acknowledge', id: number): void;
}>();

const iconComponent = computed(() => {
  switch (props.feedback.rule_id) {
    case 'category_overspend': return TrendingUp;
    case 'weekly_spending_spike': return Zap;
    case 'frequent_small_purchases': return Lightbulb;
    default: return AlertCircle;
  }
});

const iconColorClass = computed(() => {
  if (props.feedback.user_acknowledged) return 'text-slate-400';
  switch (props.feedback.rule_id) {
    case 'category_overspend': return 'text-orange-500';
    case 'weekly_spending_spike': return 'text-red-500';
    case 'frequent_small_purchases': return 'text-blue-500';
    default: return 'text-primary';
  }
});

const bgColorClass = computed(() => {
  if (props.feedback.user_acknowledged) return 'bg-slate-50';
  switch (props.feedback.rule_id) {
    case 'category_overspend': return 'bg-orange-50';
    case 'weekly_spending_spike': return 'bg-red-50';
    case 'frequent_small_purchases': return 'bg-blue-50';
    default: return 'bg-primary/5';
  }
});

function handleAcknowledge() {
  if (!props.feedback.user_acknowledged) {
    emit('acknowledge', props.feedback.id);
  }
}
</script>

<template>
  <Card 
    :class="[
      'overflow-hidden transition-all duration-300 border-none shadow-sm h-full',
      feedback.user_acknowledged ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'
    ]"
  >
    <CardContent class="p-0 flex h-full">
      <div 
        :class="[
          'w-1.5 shrink-0',
          feedback.user_acknowledged ? 'bg-slate-200' : {
            'bg-orange-500': feedback.rule_id === 'category_overspend',
            'bg-red-500': feedback.rule_id === 'weekly_spending_spike',
            'bg-blue-500': feedback.rule_id === 'frequent_small_purchases',
          }
        ]"
      />
      <div class="p-5 flex flex-col w-full">
        <div class="flex items-start justify-between mb-3">
          <div :class="['p-2 rounded-lg', bgColorClass]">
            <component :is="iconComponent" :class="['w-5 h-5', iconColorClass]" />
          </div>
          <span 
            v-if="feedback.level === 'advanced'" 
            class="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full"
          >
            Advanced
          </span>
        </div>

        <div class="space-y-2 flex-grow">
          <p class="text-sm font-semibold text-slate-900 leading-tight">
            {{ feedback.explanation }}
          </p>
          <p class="text-sm text-slate-600">
            {{ feedback.suggestion }}
          </p>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400 font-medium">
            {{ feedback.rule_id.replace(/_/g, ' ') }}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            class="h-8 text-xs font-semibold px-3"
            @click="handleAcknowledge"
            :disabled="feedback.user_acknowledged"
          >
            <CheckCircle2 v-if="feedback.user_acknowledged" class="w-3.5 h-3.5 mr-1.5 text-green-500" />
            {{ feedback.user_acknowledged ? 'Applied' : 'Acknowledge' }}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
