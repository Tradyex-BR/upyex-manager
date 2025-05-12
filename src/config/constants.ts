import { POSITION } from 'vue-toastification'

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export const API_TIMEOUT = 5000

// Authentication
export const TOKEN_KEY = 'token'
export const CONTEXT_ROLE_KEY = 'contextRole'

// Roles
export const ROLES = {
  MANAGER: 'MANAGER',
  AFFILIATE: 'AFFILIATE'
} as const

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  AFFILIATES: '/affiliates',
  CUSTOMERS: '/customers',
  SALES: '/sales',
  WITHDRAWALS: '/withdrawals',
  APPLICATIONS: '/applications'
} as const

// Toast Configuration
export const TOAST_CONFIG = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
} as const

export const APP_CONFIG = {
  APP_NAME: 'Upyex Manager',
  VERSION: '1.0.0',
  DEFAULT_LOCALE: 'pt-BR',
  DATE_FORMAT: 'DD/MM/YYYY',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm:ss',
};

export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRATION: 3600, // 1 hora em segundos
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Por favor, faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
};

// Novas constantes adicionadas
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm:ss',
  TIME: 'HH:mm:ss'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 32,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50
}; 