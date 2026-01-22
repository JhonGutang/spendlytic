import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import dashboardView from '../views/DashboardView.vue';
import transactionsView from '../views/TransactionsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboardView,
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: transactionsView,
    },
  ],
});

export default router;
