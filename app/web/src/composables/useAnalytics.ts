import { useQuery } from '@tanstack/vue-query';
import { transactionApi } from '../services/api.service';
import type { Ref } from 'vue';
import { computed } from 'vue';

/**
 * Fetch daily analytics data
 * @param days Number of days to fetch (default: 30)
 */
export function useDailyAnalytics(days?: Ref<number>) {
  const daysValue = computed(() => days?.value ?? 30);

  return useQuery({
    queryKey: ['analytics', 'daily', daysValue],
    queryFn: () => transactionApi.getDailyAnalytics(daysValue.value),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch monthly analytics data
 * @param months Number of months to fetch (default: 12)
 */
export function useMonthlyAnalytics(months?: Ref<number>) {
  const monthsValue = computed(() => months?.value ?? 12);

  return useQuery({
    queryKey: ['analytics', 'monthly', monthsValue],
    queryFn: () => transactionApi.getMonthlyAnalytics(monthsValue.value),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch yearly analytics data
 */
export function useYearlyAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'yearly'],
    queryFn: () => transactionApi.getYearlyAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
