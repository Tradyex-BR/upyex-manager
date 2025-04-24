import { defineStore } from 'pinia'
import { authService, LoginCredentials } from '../services/auth'
import { LoginResponse } from '../mocks/data/auth'

interface AuthState {
  user: LoginResponse['user'] | null
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.login(credentials)
        this.token = response.token
        this.user = response.user
        localStorage.setItem('token', response.token)
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Erro ao fazer login'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      authService.logout()
    },
    
    async checkAuth() {
      // Verifica se existe um token no localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        return false
      }
      
      // Se existir um token, verifica se ele está armazenado no estado
      if (this.token !== token) {
        this.token = token
      }
      
      // Retorna true se o token existir
      return !!this.token
    }
  }
}) 