import api from './internalService';
// Authentication interfaces
export interface ManagerLoginCredentials {
  email: string;
  password: string;
  fingerprint?: string;
  role: string;
}
export interface ManagerLoginResponse {
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

// Affiliate interfaces
export interface AffiliateApplication {
  id: string;
  commission_percentage: number;
  commission_release_days: number;
}
export interface CreateAffiliatePayload {
  name: string;
  email: string;
  integration_code: string;
  applications: AffiliateApplication[];
}
export interface Affiliate {
  id: string;
  name: string;
  email: string;
  integration_code: string;
  applications: AffiliateApplication[];
}
export interface ListAffiliatesParams {
  search: string | null;
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
}
export interface ListAffiliatesResponse {
  data: Affiliate[];
  total: number;
  page: number;
  per_page: number;
}

// Application interfaces

// Sales interfaces
export interface Sale {
  id: string;
  // TODO: add more sale fields as needed
}
export interface ListSalesParams {
  search?: string | null;
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: string;
}
export interface ListSalesResponse {
  data: Sale[];
  total: number;
  page: number;
  per_page: number;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  base_affiliate_link: string;
  is_active?: boolean;
}
export interface CreateApplicationPayload {
  name: string;
  description: string;
  logo_url: string | null;
  base_affiliate_link: string;
}
export interface UpdateApplicationPayload extends CreateApplicationPayload {
  is_active: boolean;
}
export interface ListApplicationsParams {
  search: string | null;
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
}
export interface ListApplicationsResponse {
  data: Application[];
  total: number;
  page: number;
  per_page: number;
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

export interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  method: string;
  destination: string;
  created_at: string;
  links?: {
    frontend?: string;
  };
}

export interface CreateWithdrawalPayload {
  amount: number;
  pix_key: string;
}

export interface WithdrawalResponse {
  id: string;
  status: string;
  message: string;
}

export interface ListWithdrawalsResponse {
  data: Withdrawal[];
  total: number;
  page: number;
  per_page: number;
}

import { setToken, removeToken } from './tokenService';

// Dashboard interfaces
export interface DashboardParams {
  start_date: string;
  end_date: string;
}
export interface DashboardResponse {
  cards: {
    by_status: Record<string, number>;
    by_payment_method: Record<string, number>;
  };
  withdrawals?: {
    by_status?: Record<string, number>;
  };
  customers?: {
    total?: number;
    new?: number;
  };
  // Add more fields as needed to match the API response
}

export interface ListCustomersParams {
  search: string | null;
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
}

export interface Customer {
  id: string;
  // Adicione outros campos relevantes do usuário aqui
  name?: string;
  email?: string;
}

export interface ListCustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  per_page: number;
}

export const managerService = {
  auth: {
    /**
     * Login do manager. Salva o token no localStorage.
     */
    login: async (credentials: ManagerLoginCredentials): Promise<ManagerLoginResponse> => {
      const response = await api.post<ManagerLoginResponse>(credentials.role.toLowerCase()+  '/auth', credentials);
      if (response.data?.auth_token) {
        setToken(response.data.auth_token);
      }
      return response.data;
    },
    /**
     * Logout do manager. Remove o token do localStorage.
     */
    logout: async (): Promise<void> => {
      await api.delete('/auth');
      removeToken();
    },
    /**
     * Retorna dados do usuário logado.
     */
    current: async (): Promise<any> => {
      const response = await api.get('/auth');
      return response.data;
    },
    /**
     * Envia email para recuperação de senha.
     */
    forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
      await api.request({ method: 'GET', url: '/auth/password/forgot', data: payload });
    },
    /**
     * Reseta a senha usando token enviado por email.
     */
    resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
      await api.post('/auth/password/reset', payload);
    },
    /**
     * Troca a senha do usuário autenticado.
     */
    changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
      await api.post('/auth/password/change', payload);
    },
  },

  affiliates: {
    create: async (payload: CreateAffiliatePayload): Promise<Affiliate> => {
      const response = await api.post<Affiliate>('/affiliates', payload);
      return response.data;
    },
    list: async (params: ListAffiliatesParams): Promise<ListAffiliatesResponse> => {
      const response = await api.request<ListAffiliatesResponse>({
        method: 'GET',
        url: '/affiliates',
        params,
      });
      return response.data;
    },
    get: async (id: string): Promise<Affiliate> => {
      const response = await api.get<Affiliate>(`/affiliates/${id}`);
      return response.data;
    },
    update: async (id: string, payload: Partial<CreateAffiliatePayload>): Promise<Affiliate> => {
      const response = await api.post<Affiliate>(`/affiliates/${id}`, payload);
      return response.data;
    },
    approve: async (id: string): Promise<Affiliate> => {
      // Primeiro busca os dados do afiliado
      const affiliate = await managerService.affiliates.get(id);
      // Atualiza com todos os dados + is_active true
      const response = await api.post<Affiliate>(`/affiliates/${id}`, {
        ...affiliate,
        is_active: true
      });
      return response.data;
    },
    block: async (id: string): Promise<Affiliate> => {
      // Primeiro busca os dados do afiliado
      const affiliate = await managerService.affiliates.get(id);
      // Atualiza com todos os dados + is_active false
      const response = await api.post<Affiliate>(`/affiliates/${id}`, {
        ...affiliate,
        is_active: false
      });
      return response.data;
    },
  },

  applications: {
    create: async (payload: CreateApplicationPayload): Promise<Application> => {
      const response = await api.post<Application>('/applications', payload);
      return response.data;
    },
    list: async (params: ListApplicationsParams): Promise<ListApplicationsResponse> => {
      const response = await api.request<ListApplicationsResponse>({
        method: 'GET',
        url: '/applications',
        data: params,
      });
      return response.data;
    },
    get: async (id: string): Promise<Application> => {
      const response = await api.get<Application>(`/applications/${id}`);
      return response.data;
    },
    update: async (id: string, payload: UpdateApplicationPayload): Promise<Application> => {
      const response = await api.post<Application>(`/applications/${id}`, payload);
      return response.data;
    },
    resetSecret: async (id: string): Promise<void> => {
      await api.post(`/applications/${id}/reset-secret`);
    },
    generateAffiliateLink: async (applicationId: string): Promise<{ affiliate_link: string }> => {
      const response = await api.get<{ affiliate_link: string }>(`/affiliate/applications/${applicationId}/affiliate-link`);
      return response.data;
    },
  },

  dashboard: {
    getData: async (payload: DashboardParams): Promise<DashboardResponse> => {
      const response = await api.request<DashboardResponse>({
        method: 'GET',
        url: '/dashboard',
        params: payload, // Envia como query params
      });
      return response.data;
    },
  },

  withdrawals: {
    /**
     * Lista saques (withdrawals) do manager.
     */
    list: async (params: ListWithdrawalsParams): Promise<ListWithdrawalsResponse> => {
      const response = await api.request<ListWithdrawalsResponse>({
        method: 'GET',
        url: '/withdrawals',
        data: params,
      });
      return response.data;
    },

    /**
     * Solicita um novo saque
     */
    request: async (payload: CreateWithdrawalPayload): Promise<WithdrawalResponse> => {
      const response = await api.post<WithdrawalResponse>('/withdrawals', payload);
      return response.data;
    },

    /**
     * Aprova um saque
     */
    approve: async (id: string): Promise<WithdrawalResponse> => {
      const response = await api.post<WithdrawalResponse>(`/withdrawals/${id}/approve`);
      return response.data;
    },

    /**
     * Rejeita um saque
     */
    reject: async (id: string): Promise<WithdrawalResponse> => {
      const response = await api.post<WithdrawalResponse>(`/withdrawals/${id}/reject`);
      return response.data;
    }
  },

  customers: {
    /**
     * Lista usuários (customers) do manager.
     */
    list: async (params: ListCustomersParams): Promise<ListCustomersResponse> => {
      const response = await api.request<ListCustomersResponse>({
        method: 'GET',
        url: '/customers',
        data: params,
      });
      return response.data;
    },
  },

  // Keep other services below

  sales: {
    /**
     * Lista vendas (sales) do manager.
     */
    list: async (params: ListSalesParams): Promise<ListSalesResponse> => {
      const response = await api.request<ListSalesResponse>({
        method: 'GET',
        url: '/sales',
        data: params,
      });
      return response.data;
    },
  },
};
