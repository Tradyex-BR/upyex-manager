import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT, TOKEN_KEY, CONTEXT_ROLE_KEY } from '@/config/constants'

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

export default api 