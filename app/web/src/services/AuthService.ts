import axios from 'axios';
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://finance-behavioral-system.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/register', credentials);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/logout');
  },

  async me(): Promise<{ user: User }> {
    const response = await apiClient.get('/me');
    return response.data;
  },
};

export default apiClient;
