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
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: transactionsView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _, next) => {
  const isAuthenticated = !!localStorage.getItem('auth_token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
