import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { managerService } from '@/services/managerService'
import { CONTEXT_ROLE_KEY } from '@/config/constants'

interface User {
  id: number
  name: string
  email: string
  role?: string
  avatar_path: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    // Salva o papel do usuário antes de limpar
    const currentRole = localStorage.getItem(CONTEXT_ROLE_KEY) || 'manager'

    // Limpa os dados de autenticação
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.setItem(CONTEXT_ROLE_KEY, currentRole)

    // Redireciona para a página de login correspondente
    window.location.href = `/login/${currentRole}`
  }

  const login = async (credentials: { email: string; password: string; fingerprint: string }) => {
    try {
      const response = await managerService.auth.login({
        email: credentials.email,
        password: credentials.password,
        fingerprint: credentials.fingerprint,
      })
      const token = response.auth_token
      const user = await managerService.auth.current()

      setAuth(token, user)
      return user
    } catch (error) {
      throw error
    }
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      setAuth(token, JSON.parse(user))
      return true
    }
    return false
  }

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    logout,
    login,
    checkAuth
  }
}) 