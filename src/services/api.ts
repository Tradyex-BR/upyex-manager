import axios from 'axios'
import { notificationService } from './notificationService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/', // Usa variável de ambiente ou '/' para proxy
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    // Se a resposta tiver uma mensagem de sucesso, exibe o toast
    if (response.data?.message) {
      notificationService.success(response.data.message)
    }
    return response
  },
  (error) => {
    // Trata erros da API
    const message = error.response?.data?.message || 'Ocorreu um erro inesperado'
    notificationService.error(message)
    return Promise.reject(error)
  }
)

export default api 