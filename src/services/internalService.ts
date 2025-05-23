import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT, TOKEN_KEY, CONTEXT_ROLE_KEY, ERROR_MESSAGES } from '@/config/constants'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const role = localStorage.getItem(CONTEXT_ROLE_KEY)
  if (role) {
    config.baseURL += `/${role.toLowerCase()}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          const authStore = useAuthStore()
          const router = useRouter()
          // Só redireciona se não estiver na página de login
          if (!router.currentRoute.value.path.includes('/login')) {
            authStore.handleUnauthorized()
          }
          break
        case 403:
          throw new Error(ERROR_MESSAGES.FORBIDDEN)
        case 404:
          throw new Error(ERROR_MESSAGES.NOT_FOUND)
        case 500:
          throw new Error(ERROR_MESSAGES.SERVER_ERROR)
        default:
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
      }
    }
    return Promise.reject(error)
  }
)

export default api 