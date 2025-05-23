// Serviço utilitário para manipulação do token de autenticação

import { TOKEN_KEY } from '@/config/constants'

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
};

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
};
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
};
