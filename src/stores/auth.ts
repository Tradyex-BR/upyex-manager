import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { managerService } from '@/services/managerService'
import { useRouter } from 'vue-router'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar_path: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const setAuth = (newToken: string, newUser: any) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    // Salva o papel do usuário antes de limpar
    const currentRole = user.value?.role?.toLowerCase() || localStorage.getItem('role') || 'manager'
    
    // Limpa os dados de autenticação
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Mantém apenas o papel do usuário
    localStorage.setItem('role', currentRole)
    
    // Redireciona para a página de login correspondente
    window.location.href = `/login/${currentRole}`
  }

  const login = async (credentials: { email: string; password: string; role: 'MANAGER' | 'AFFILIATE'; fingerprint: string }) => {
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