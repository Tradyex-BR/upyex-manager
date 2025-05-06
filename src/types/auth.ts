export interface LoginRequest {
  email: string
  password: string
  role: 'MANAGER' | 'AFFILIATE'
  fingerprint: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    role: 'MANAGER' | 'AFFILIATE'
  }
} 