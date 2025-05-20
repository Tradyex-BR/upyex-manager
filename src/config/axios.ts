import axios from 'axios';
import { API_BASE_URL, AUTH_CONFIG } from './constants';
import { logger } from '@/config/logger';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas e erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Tratamento de erro 401 (Unauthorized)
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.handleUnauthorized();
      return Promise.reject(error);
    }

    // Tratamento de outros erros
    const errorMessage = error.response?.data?.message || 'Erro na requisição';
    logger.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

export default api; 