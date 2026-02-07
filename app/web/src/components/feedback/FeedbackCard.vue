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
  if (props.feedback.user_acknowledged) return 'text-emerald-900/30';
  switch (props.feedback.rule_id) {
    case 'category_overspend': return 'text-amber-600';
    case 'weekly_spending_spike': return 'text-rose-600';
    case 'frequent_small_purchases': return 'text-teal-600';
    default: return 'text-emerald-700';
  }
});

const bgColorClass = computed(() => {
  if (props.feedback.user_acknowledged) return 'bg-emerald-50/50';
  switch (props.feedback.rule_id) {
    case 'category_overspend': return 'bg-amber-50';
    case 'weekly_spending_spike': return 'bg-rose-50';
    case 'frequent_small_purchases': return 'bg-teal-50';
    default: return 'bg-emerald-50';
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
      'overflow-hidden transition-all duration-300 border border-emerald-100/50 bg-white/60 backdrop-blur-sm h-full',
      feedback.user_acknowledged ? 'opacity-60 grayscale-[0.3]' : 'hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-0.5'
    ]"
  >
    <CardContent class="p-0 flex h-full">
      <div 
        :class="[
          'w-1.5 shrink-0',
          feedback.user_acknowledged ? 'bg-emerald-100' : {
            'bg-amber-500': feedback.rule_id === 'category_overspend',
            'bg-rose-500': feedback.rule_id === 'weekly_spending_spike',
            'bg-teal-500': feedback.rule_id === 'frequent_small_purchases',
          }
        ]"
      />
      <div class="p-5 flex flex-col w-full">
        <div class="flex items-start justify-between mb-4">
          <div :class="['p-2 rounded-lg', bgColorClass]">
            <component :is="iconComponent" :class="['w-5 h-5', iconColorClass]" />
          </div>
          <span 
            v-if="feedback.level === 'advanced'" 
            class="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full"
          >
            Advanced
          </span>
        </div>

        <div class="space-y-3 flex-grow">
          <p class="text-sm font-semibold text-emerald-950 leading-snug font-serif">
            {{ feedback.explanation }}
          </p>
          <p class="text-xs text-emerald-900/60 leading-relaxed">
            {{ feedback.suggestion }}
          </p>
        </div>

        <div class="mt-5 pt-4 border-t border-emerald-100/50 flex items-center justify-between">
          <span class="text-[10px] text-emerald-900/40 font-medium uppercase tracking-wider">
            {{ feedback.rule_id.replace(/_/g, ' ') }}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            class="h-8 text-xs font-semibold px-3 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            @click="handleAcknowledge"
            :disabled="feedback.user_acknowledged"
          >
            <CheckCircle2 v-if="feedback.user_acknowledged" class="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            <span :class="feedback.user_acknowledged ? 'text-emerald-700' : 'text-emerald-600'">
                {{ feedback.user_acknowledged ? 'Applied' : 'Acknowledge' }}
            </span>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
