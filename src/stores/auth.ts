import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: number; name: string; email: string } | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user: userData, token: accessToken } = response.data
      
      user.value = userData
      token.value = accessToken
      isAuthenticated.value = true
      
      localStorage.setItem('token', accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      return true
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        const response = await api.get('/auth/me')
        user.value = response.data
        token.value = storedToken
        isAuthenticated.value = true
        return true
      } catch (error) {
        logout()
        return false
      }
    }
    return false
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}) 