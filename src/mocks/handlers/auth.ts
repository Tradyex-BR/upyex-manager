import { AxiosError } from 'axios';
import { mockLoginResponse, mockLoginError } from '../data/auth';

export const handleLogin = async (email: string, password: string) => {
  // Simula um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simula validação de credenciais
  if (email === 'usuario@teste.com' && password === '123456') {
    return mockLoginResponse;
  }

  throw new AxiosError(
    mockLoginError.message,
    mockLoginError.status.toString(),
    undefined,
    undefined,
    {
      status: mockLoginError.status,
      data: mockLoginError
    } as any
  );
}; 