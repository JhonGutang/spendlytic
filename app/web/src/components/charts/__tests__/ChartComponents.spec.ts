import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import DailyFlowChart from '../DailyFlowChart.vue';
import MonthlyFlowChart from '../MonthlyFlowChart.vue';
import YearlyFlowChart from '../YearlyFlowChart.vue';
import { transactionApi } from '@/services/api.service';
import type { AnalyticsData } from '@/types';

// Mock the API service
vi.mock('@/services/api.service', () => ({
  transactionApi: {
    getDailyAnalytics: vi.fn(),
    getMonthlyAnalytics: vi.fn(),
    getYearlyAnalytics: vi.fn(),
  },
}));

// Mock BaseChart component
vi.mock('../BaseChart.vue', () => ({
  default: {
    name: 'BaseChart',
    props: ['data', 'isEmpty', 'emptyMessage', 'loading', 'title'],
    template: '<div class="mock-base-chart">{{ emptyMessage }}</div>',
  },
}));

const mockDataWithValues: AnalyticsData = {
  labels: ['Jan 1', 'Jan 2'],
  income: [100, 200],
  expenses: [50, 75],
};

const mockEmptyData: AnalyticsData = {
  labels: ['Jan 1', 'Jan 2'],
  income: [0, 0],
  expenses: [0, 0],
};

describe('Chart Components', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    setActivePinia(createPinia());
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  describe('DailyFlowChart', () => {
    it('renders with data', async () => {
      vi.mocked(transactionApi.getDailyAnalytics).mockResolvedValue(mockDataWithValues);

      const wrapper = mount(DailyFlowChart, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      });

      await vi.waitFor(() => {
        expect(wrapper.find('.mock-base-chart').exists()).toBe(true);
      });
    });

    it('detects empty state correctly', async () => {
      vi.mocked(transactionApi.getDailyAnalytics).mockResolvedValue(mockEmptyData);

      const wrapper = mount(DailyFlowChart, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      });

      await vi.waitFor(() => {
        const baseChart = wrapper.findComponent({ name: 'BaseChart' });
        expect(baseChart.props('isEmpty')).toBe(true);
      });
    });

    it('shows correct empty message', async () => {
      vi.mocked(transactionApi.getDailyAnalytics).mockResolvedValue(mockEmptyData);

      const wrapper = mount(DailyFlowChart, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      });

      await vi.waitFor(() => {
        expect(wrapper.text()).toContain('No transactions in the last 30 days');
      });
    });

    it('detects non-empty state correctly', async () => {
      vi.mocked(transactionApi.getDailyAnalytics).mockResolvedValue(mockDataWithValues);

      const wrapper = mount(DailyFlowChart, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      });

      await vi.waitFor(() => {
        const baseChart = wrapper.findComponent({ name: 'BaseChart' });
        expect(baseChart.props('isEmpty')).toBe(false);
      });
    });
  });

  describe('MonthlyFlowChart', () => {
    it('renders with data', async () => {
      vi.mocked(transactionApi.getMonthlyAnalytics).mockResolvedValue(mockDataWithValues);

      const wrapper = mount(MonthlyFlowChart, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      });

      await vi.waitFor(() => {
        expect(wrapper.find('.mock-base-chart').exists()).toBe(true);
      });
    });

    it('shows correct empty message', async () => {
      vi.mocked(transactionApi.getMonthlyAnalytics).mockResolvedValue(mockEmptyData);

      const wrapper = mount(MonthlyFlowChart, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      });

      await vi.waitFor(() => {
        expect(wrapper.text()).toContain('No transactions in the last 12 months');
      });
    });
  });

  describe('YearlyFlowChart', () => {
    it('renders with data', async () => {
      vi.mocked(transactionApi.getYearlyAnalytics).mockResolvedValue(mockDataWithValues);

      const wrapper = mount(YearlyFlowChart, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      });

      await vi.waitFor(() => {
        expect(wrapper.find('.mock-base-chart').exists()).toBe(true);
      });
    });

    it('shows correct empty message', async () => {
      vi.mocked(transactionApi.getYearlyAnalytics).mockResolvedValue(mockEmptyData);

      const wrapper = mount(YearlyFlowChart, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      });

      await vi.waitFor(() => {
        expect(wrapper.text()).toContain('No transaction history yet');
      });
    });
  });
});
