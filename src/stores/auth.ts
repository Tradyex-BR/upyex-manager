import { defineStore } from 'pinia'
import { managerService } from '@/services/managerService'
import { useRouter } from 'vue-router'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar_path: string
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
    async login(credentials: { email: string; password: string; role: 'MANAGER' | 'AFFILIATE'; fingerprint: string }) {
      try {
        const response = await managerService.auth.login({
          email: credentials.email,
          password: credentials.password,
          fingerprint: credentials.fingerprint,
          role: credentials.role
        })
        const token = response.auth_token
        // Buscar dados do usuário logado
        localStorage.removeItem('userRole')
        localStorage.setItem('role', credentials.role.toLowerCase())
        const user = await managerService.auth.current()
        user.role = 'MANAGER'

        this.user = user
        this.token = token
        // Salvar no localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        return user
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
        localStorage.removeItem('userRole')
        localStorage.removeItem('role')

        // Chamar o serviço de logout
        await managerService.auth.logout()

        // Redirecionar para a página de login usando window.location
        window.location.href = '/login'

      } catch (error) {
        throw error
      }
    },

    // Método para verificar se o usuário está autenticado ao carregar a página
    async checkAuth() {
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