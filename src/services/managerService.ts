import api from './internalService';
// Authentication interfaces
export interface ManagerLoginCredentials {
  email: string;
  password: string;
  fingerprint?: string;
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Application interfaces

// Sales interfaces
export interface Sale {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  payment_method: string;
  products: Array<{
    amount: number;
    price: number;
  }>;
  customer?: {
    name: string;
    external_id: string;
    application?: {
      id: string;
      name: string;
      logo_url: string;
    };
  };
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
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface Application {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  base_affiliate_link: string;
  is_active?: boolean;
  api_secret?: string;
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
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ListWithdrawalsParams {
  search?: string | null;
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
  external_id?: string | null;
  amount: string;
  status: string;
  method: string;
  destination: string;
  approved_at?: string | null;
  rejected_at?: string | null;
  processing_at?: string | null;
  processed_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
  links?: {
    api?: string;
    frontend?: string;
  };
}

export interface CreateWithdrawalPayload {
  amount: number;
  method: string;
  destination: string;
}

export interface WithdrawalResponse {
  id: string;
  status: string;
  message: string;
  minimum_amount?: number;
  maximum_amount?: number;
  daily_limit?: number;
  withdrawals_today?: number;
  current_balance?: number;
}

export interface ListWithdrawalsResponse {
  data: Withdrawal[];
  total: number;
  page: number;
  per_page: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

import { setToken, removeToken } from './tokenService';

// Dashboard interfaces
export interface DashboardParams {
  start_date: string;
  end_date: string;
}

export interface DashboardResponse {
  sales: {
    cards: {
      by_status: {
        awaiting_payment: number;
        paid: number;
        refunded: number;
        cancelled: number;
        failed: number;
      };
      by_payment_method: {
        bank_transfer: number;
        credit_card: number;
        debit_card: number;
        payment_link: number;
        pix: number;
      };
    };
    graph: Array<{
      date: string;
      count: number;
    }>;
  };
  withdrawals: {
    by_status: {
      requested: number;
      approved: number;
      rejected: number;
      processing: number;
      processed: number;
      cancelled: number;
      failed: number;
    };
  };
  customers: {
    total: number;
    new: number;
  };
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
  name: string;
  email: string;
  phone: string;
  document_number: string;
  status: string;
  links?: {
    api: string;
  };
}

export interface ListCustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  per_page: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export const managerService = {
  auth: {
    /**
     * Login do manager. Salva o token no localStorage.
     */
    login: async (credentials: ManagerLoginCredentials): Promise<ManagerLoginResponse> => {
      const response = await api.post<ManagerLoginResponse>('/auth', credentials);
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
      const response = await api.get(`/auth`);
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
        name: affiliate.name,
        email: affiliate.email,
        integration_code: affiliate.integration_code,
        is_active: true,
        applications: affiliate.applications.map(app => ({
          id: app.id,
          commission_percentage: app.commission_percentage,
          commission_release_days: app.commission_release_days
        }))
      });
      return response.data;
    },
    block: async (id: string): Promise<Affiliate> => {
      // Primeiro busca os dados do afiliado
      const affiliate = await managerService.affiliates.get(id);
      // Atualiza com todos os dados + is_active false
      const response = await api.post<Affiliate>(`/affiliates/${id}`, {
        name: affiliate.name,
        email: affiliate.email,
        integration_code: affiliate.integration_code,
        is_active: false,
        applications: affiliate.applications.map(app => ({
          id: app.id,
          commission_percentage: app.commission_percentage,
          commission_release_days: app.commission_release_days
        }))
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
        params: params,
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
      const response = await api.get<{ affiliate_link: string }>(`/${applicationId}/affiliate-link`);
      return response.data;
    },
  },

  dashboard: {
    getData: async (payload: DashboardParams, paidSales: number = 0): Promise<DashboardResponse> => {
      const response = await api.request<DashboardResponse>({
        method: 'GET',
        url: '/dashboard?paid_sales_only=' + paidSales,
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
        params: params,
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
    },

    /**
  * Cancela um saque
  */
    cancel: async (id: string): Promise<WithdrawalResponse> => {
      const response = await api.post<WithdrawalResponse>(`/withdrawals/${id}/cancel`);
      return response.data;
    },

    /**
     * Resgata o valor do saque
     */
    information: async (): Promise<WithdrawalResponse> => {
      const response = await api.get<WithdrawalResponse>(`/withdrawals/information`);
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
        params: params,
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
        params: params,
      });
      return response.data;
    },
  },
};
