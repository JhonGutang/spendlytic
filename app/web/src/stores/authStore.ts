import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
import { AuthService } from '../services/AuthService';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginCredentials) {
    loading.value = true;
    error.value = null;
    try {
      const response = await AuthService.login(credentials);
      token.value = response.access_token;
      user.value = response.user;
      
      localStorage.setItem('auth_token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      
      router.push('/dashboard');
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(credentials: RegisterCredentials) {
    loading.value = true;
    error.value = null;
    try {
      const response = await AuthService.register(credentials);
      token.value = response.access_token;
      user.value = response.user;
      
      localStorage.setItem('auth_token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      
      router.push('/dashboard');
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await AuthService.logout();
      }
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/');
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await AuthService.me();
      user.value = response.user;
      localStorage.setItem('user', JSON.stringify(user.value));
    } catch (err) {
      logout();
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  };
});
