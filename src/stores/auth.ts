import { defineStore } from 'pinia'
import { managerService } from '@/services/managerService'
import { affiliateService } from '@/services/affiliateService'

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
    async login(credentials: { email: string; password: string; role: 'MANAGER' | 'AFFILIATE'; fingerprint: string }) {
  try {
    let response
    let token
    let user
    if (credentials.role === 'MANAGER') {
      response = await managerService.auth.login({
        email: credentials.email,
        password: credentials.password,
        fingerprint: credentials.fingerprint
      })
      token = response.auth_token
      // Buscar dados do usuário logado
      user = await managerService.auth.current()
      user.role = 'MANAGER'
    } else {
      response = await affiliateService.auth.login({
        email: credentials.email,
        password: credentials.password,
        fingerprint: credentials.fingerprint
      })
      token = response.auth_token
      user = await affiliateService.auth.current()
      user.role = 'AFFILIATE'
    }
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
        
        // Chamar o serviço de logout
        if ((this.user as any)?.role === 'MANAGER') {
  await managerService.auth.logout()
} else if ((this.user as any)?.role === 'AFFILIATE') {
  await affiliateService.auth.logout()
}
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