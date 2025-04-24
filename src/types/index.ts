// Tipos comuns
export interface User {
  id: number
  name: string
  email: string
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

// Tipos de erro
export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
} 