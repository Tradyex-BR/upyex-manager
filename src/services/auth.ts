import api from './api';
import { handleLogin } from '../mocks/handlers/auth';
import { LoginResponse } from '../mocks/data/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (import.meta.env.DEV) {
      return handleLogin(credentials.email, credentials.password);
    }

    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    // Adicione aqui qualquer lógica adicional de logout
  }
}; 