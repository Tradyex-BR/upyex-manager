import { useAuthStore } from '@/stores/auth'
import { useAuthContextStore } from '@/stores/auth-context'
import { storeToRefs } from 'pinia'

// Lista de chaves que devem ser mantidas no localStorage
const PERSISTENT_KEYS = ['theme', 'language']

// Lista de chaves que devem ser limpas ao fazer logout
const AUTH_KEYS = ['token', 'user', 'recoveryEmail']

export const clearAuthData = () => {
  // Limpa todas as chaves de autenticação
  AUTH_KEYS.forEach(key => localStorage.removeItem(key))

  // Limpa o store de autenticação
  const authStore = useAuthStore()
  authStore.logout()

  // Limpa o store de contexto
  const authContextStore = useAuthContextStore()
}

export const clearNonPersistentData = () => {
  // Obtém todas as chaves do localStorage
  const keys = Object.keys(localStorage)

  // Remove todas as chaves que não estão na lista de persistentes
  keys.forEach(key => {
    if (!PERSISTENT_KEYS.includes(key)) {
      localStorage.removeItem(key)
    }
  })
}

export const isAuthenticated = () => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore)
  return isAuthenticated.value
}

export const getCurrentRole = () => {
  const authContextStore = useAuthContextStore()
  const { userRole } = storeToRefs(authContextStore)
  return userRole.value || localStorage.getItem('contextRole') || 'manager'
}

export const getDashboardPath = () => {
  const role = getCurrentRole()
  return role === 'AFFILIATE' ? '/affiliate/dashboard' : '/dashboard'
}

export const getLoginPath = () => {
  const role = getCurrentRole()
  return `/login/${role.toLowerCase()}`
}

export const getNotFoundPath = () => {
  const role = getCurrentRole()
  return `/404/${role.toLowerCase()}`
} 