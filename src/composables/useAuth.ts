import { ref, computed } from 'vue'
import { managerService } from '@/services/managerService'
import { affiliateService } from '@/services/affiliateService'

// Tipos possíveis de usuário
export type AuthRole = 'manager' | 'affiliate'

// Estado reativo global por role
const userState: Record<AuthRole, any> = {
  manager: ref(null),
  affiliate: ref(null)
}
const loadingState: Record<AuthRole, any> = {
  manager: ref(false),
  affiliate: ref(false)
}
const errorState: Record<AuthRole, any> = {
  manager: ref(null),
  affiliate: ref(null)
}

function getService(role: AuthRole) {
  return role === 'manager' ? managerService.auth : affiliateService.auth
}

export function useAuth(role: AuthRole) {
  const user = userState[role]
  const loading = loadingState[role]
  const error = errorState[role]

  async function login(payload: { email: string; password: string; fingerprint?: string }) {
    loading.value = true
    error.value = null
    try {
      await getService(role).login(payload)
      user.value = await getService(role).current()
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Erro ao fazer login'
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null
    try {
      await getService(role).logout()
      user.value = null
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Erro ao fazer logout'
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    loading.value = true
    error.value = null
    try {
      user.value = await getService(role).current()
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Erro ao buscar usuário'
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(payload: { email: string }) {
    loading.value = true
    error.value = null
    try {
      await getService(role).forgotPassword(payload)
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Erro ao solicitar recuperação'
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(payload: { email: string; token: string; new_password: string }) {
    loading.value = true
    error.value = null
    try {
      await getService(role).resetPassword(payload)
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Erro ao resetar senha'
    } finally {
      loading.value = false
    }
  }

  async function changePassword(payload: { current_password: string; new_password: string }) {
    loading.value = true
    error.value = null
    try {
      await getService(role).changePassword(payload)
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Erro ao trocar senha'
    } finally {
      loading.value = false
    }
  }

  // Computed para saber se está autenticado
  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser,
    forgotPassword,
    resetPassword,
    changePassword
  }
}
