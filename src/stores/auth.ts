import { defineStore } from 'pinia'
import { authService } from '@/services/auth'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const response = await authService.login(credentials)
        
        this.user = response.user
        this.token = response.token
        
        // Salvar no localStorage
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        return response.user
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        // Limpar o estado
        this.user = null
        this.token = null
        
        // Limpar o localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Chamar o serviço de logout
        authService.logout()
      } catch (error) {
        throw error
      }
    },

    // Método para verificar se o usuário está autenticado ao carregar a página
    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        return true
      }
      
      return false
    }
  }
}) 