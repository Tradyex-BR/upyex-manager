export interface LoginRequest {
  email: string
  password: string
  role: 'MANAGER' | 'AFFILIATE'
  fingerprint: string
}

export interface User {
  id: number
  name: string
  email: string
  role?: string
  avatar_path: string
}

export interface ManagerLoginCredentials {
  email: string
  password: string
  fingerprint?: string
}

export interface AuthResponse {
  token: string
  user: User
} 