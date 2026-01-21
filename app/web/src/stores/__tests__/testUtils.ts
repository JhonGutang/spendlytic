import { VueQueryPlugin } from '@tanstack/vue-query';
import { QueryClient } from '@tanstack/vue-query';
import type { App } from 'vue';

/**
 * Creates a new QueryClient for testing
 * Disables retries and sets short cache times for faster tests
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Installs Vue Query plugin for testing
 * Call this in beforeEach to set up a fresh QueryClient for each test
 */
export function installVueQueryPlugin(app: App) {
  const queryClient = createTestQueryClient();
  app.use(VueQueryPlugin, { queryClient });
  return queryClient;
}
