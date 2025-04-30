import api from './api';

// Authentication interfaces
export interface AffiliateLoginCredentials {
  email: string;
  password: string;
  fingerprint?: string;
}
export interface AffiliateLoginResponse {
  auth_token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}
export interface ResetPasswordPayload {
  email: string;
  token: string;
  new_password: string;
}
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

// Dashboard
export interface DashboardParams {
  start_date: string;
  end_date: string;
}
export interface DashboardResponse {
  // TODO: type according to API response
}

// Applications interfaces
export interface ListAffiliateApplicationsParams {
  search: string | null;
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
}
export interface Application {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  base_affiliate_link: string;
}
export interface AffiliateLinkResponse {
  affiliate_link: string;
}

// Customers
export interface ListCustomersParams {
  search: string | null;
  application_id: string | null;
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
}

// Sales
export interface ListSalesParams {
  start_date: string;
  end_date: string;
  application_id: string | null;
  customer_id: string | null;
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
}
export interface Sale {
  id: string;
  // TODO: more fields
}

// Withdrawals
export interface RequestWithdrawalPayload {
  amount: number;
  method: string;
  destination: string;
}

export interface ListWithdrawalsParams {
  start_date: string;
  end_date: string;
  status: string | null;
  method: string | null;
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
}

import { setToken, removeToken } from './tokenService';

export const affiliateService = {
  auth: {
    /**
     * Login do afiliado. Salva o token no localStorage.
     */
    login: async (credentials: AffiliateLoginCredentials): Promise<AffiliateLoginResponse> => {
      const response = await api.post<AffiliateLoginResponse>('/affiliate/auth', credentials);
      if (response.data?.auth_token) {
        setToken(response.data.auth_token);
      }
      return response.data;
    },
    /**
     * Logout do afiliado. Remove o token do localStorage.
     */
    logout: async (): Promise<void> => {
      await api.delete('/affiliate/auth');
      removeToken();
    },
    /**
     * Retorna dados do usuário afiliado logado.
     */
    current: async (): Promise<any> => {
      const response = await api.get('/affiliate/auth');
      return response.data;
    },
    /**
     * Envia email para recuperação de senha.
     */
    forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
      await api.request({ method: 'GET', url: '/affiliate/auth/password/forgot', data: payload });
    },
    /**
     * Reseta a senha usando token enviado por email.
     */
    resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
      await api.post('/affiliate/auth/password/reset', payload);
    },
    /**
     * Troca a senha do afiliado autenticado.
     */
    changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
      await api.post('/affiliate/auth/password/change', payload);
    },
  },

  dashboard: {
    getData: async (params: DashboardParams): Promise<DashboardResponse> => {
      const response = await api.request<DashboardResponse>({
        method: 'GET',
        url: '/affiliate/dashboard',
        data: params,
      });
      return response.data;
    },
  },
  
  applications: {
    get: async (id: string): Promise<Application> => {
      const response = await api.get<Application>(`/affiliate/applications/${id}`);
      return response.data;
    },
    list: async (params: ListAffiliateApplicationsParams): Promise<{ data: Application[]; total: number; page: number; per_page: number } > => {
      const response = await api.request<{ data: Application[]; total: number; page: number; per_page: number }>({
        method: 'GET',
        url: '/affiliate/applications',
        data: params,
      });
      return response.data;
    },
    getAffiliateLink: async (id: string): Promise<AffiliateLinkResponse> => {
      const response = await api.get<AffiliateLinkResponse>(`/affiliate/applications/${id}/affiliate-link`);
      return response.data;
    },
    getDropdown: async (): Promise<{ id: string; name: string }[]> => {
      const response = await api.get<{ id: string; name: string }[]>('/affiliate/applications/dropdown');
      return response.data;
    },
  },

  customers: {
    list: async (params: ListCustomersParams): Promise<{ data: Customer[]; total: number; page: number; per_page: number }> => {
      const response = await api.request<{ data: Customer[]; total: number; page: number; per_page: number }>({
        method: 'GET',
        url: '/affiliate/customers',
        data: params,
      });
      return response.data;
    },
    get: async (id: string): Promise<Customer> => {
      const response = await api.get<Customer>(`/affiliate/customers/${id}`);
      return response.data;
    },
  },

  sales: {
    list: async (params: ListSalesParams): Promise<{ data: Sale[]; total: number; page: number; per_page: number }> => {
      const response = await api.request<{ data: Sale[]; total: number; page: number; per_page: number }>({
        method: 'GET',
        url: '/affiliate/sales',
        data: params,
      });
      return response.data;
    },
    get: async (id: string): Promise<Sale> => {
      const response = await api.get<Sale>(`/affiliate/sales/${id}`);
      return response.data;
    },
  },

  withdrawals: {
    request: async (payload: RequestWithdrawalPayload): Promise<any> => {
      const response = await api.post('/affiliate/withdrawals', payload);
      return response.data;
    },
    get: async (id: string): Promise<any> => {
      const response = await api.get(`/affiliate/withdrawals/${id}`);
      return response.data;
    },
    list: async (params: ListWithdrawalsParams): Promise<{ data: any[]; total: number; page: number; per_page: number }> => {
      const response = await api.request<{ data: any[]; total: number; page: number; per_page: number }>({
        method: 'GET',
        url: '/affiliate/withdrawals',
        data: params,
      });
      return response.data;
    },
    cancel: async (id: string): Promise<void> => {
      await api.delete(`/affiliate/withdrawals/${id}`);
    },
  },
};
