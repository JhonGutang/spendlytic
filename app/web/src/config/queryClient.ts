import { QueryClient } from '@tanstack/vue-query';

/**
 * Vue Query Client Configuration
 * 
 * Optimized for finance data with appropriate caching strategies:
 * - staleTime: Data considered fresh for 5 minutes
 * - gcTime: Cached data garbage collected after 10 minutes
 * - refetchOnWindowFocus: Auto-refetch when user returns to tab
 * - retry: Retry failed requests up to 3 times with exponential backoff
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Garbage collection time - cached data removed after 10 minutes of being unused
      gcTime: 10 * 60 * 1000, // 10 minutes
      
      // Automatically refetch when window regains focus
      refetchOnWindowFocus: true,
      
      // Retry failed requests
      retry: 3,
      
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});
