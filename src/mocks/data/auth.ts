export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const mockLoginResponse: LoginResponse = {
  token: 'mock-jwt-token-123',
  user: {
    id: 1,
    name: 'Usuário Teste',
    email: 'usuario@teste.com',
    role: 'admin'
  }
};

export const mockLoginError = {
  message: 'Credenciais inválidas',
  status: 401
}; 