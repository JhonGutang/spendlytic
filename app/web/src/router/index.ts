import { createRouter, createWebHistory } from 'vue-router';
import dashboardView from '../views/DashboardView.vue';
import transactionsView from '../views/TransactionsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue'),
    },
  ],
});

export default router;
