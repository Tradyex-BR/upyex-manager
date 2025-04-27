import api from './api';

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

export const managerService = {
  auth: {
    login: async (credentials: ManagerLoginCredentials): Promise<ManagerLoginResponse> => {
      const response = await api.post<ManagerLoginResponse>('/manager/auth', credentials);
      return response.data;
    },
    logout: async (): Promise<void> => {
      await api.delete('/manager/auth');
    },
    current: async (): Promise<any> => {
      const response = await api.get('/manager/auth');
      return response.data;
    },
    forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
      await api.request({ method: 'GET', url: '/manager/auth/password/forgot', data: payload });
    },
    resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
      await api.post('/manager/auth/password/reset', payload);
    },
    changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
      await api.post('/manager/auth/password/change', payload);
    },
  },

  affiliates: {
    create: async (payload: CreateAffiliatePayload): Promise<Affiliate> => {
      const response = await api.post<Affiliate>('/manager/affiliates', payload);
      return response.data;
    },
    list: async (params: ListAffiliatesParams): Promise<ListAffiliatesResponse> => {
      const response = await api.request<ListAffiliatesResponse>({
        method: 'GET',
        url: '/manager/affiliates',
        data: params,
      });
      return response.data;
    },
    get: async (id: string): Promise<Affiliate> => {
      const response = await api.get<Affiliate>(`/manager/affiliates/${id}`);
      return response.data;
    },
    update: async (id: string, payload: Partial<CreateAffiliatePayload>): Promise<Affiliate> => {
      const response = await api.post<Affiliate>(`/manager/affiliates/${id}`, payload);
      return response.data;
    },
  },

  applications: {
    create: async (payload: CreateApplicationPayload): Promise<Application> => {
      const response = await api.post<Application>('/manager/applications', payload);
      return response.data;
    },
    list: async (params: ListApplicationsParams): Promise<ListApplicationsResponse> => {
      const response = await api.request<ListApplicationsResponse>({
        method: 'GET',
        url: '/manager/applications',
        data: params,
      });
      return response.data;
    },
    get: async (id: string): Promise<Application> => {
      const response = await api.get<Application>(`/manager/applications/${id}`);
      return response.data;
    },
    update: async (id: string, payload: UpdateApplicationPayload): Promise<Application> => {
      const response = await api.post<Application>(`/manager/applications/${id}`, payload);
      return response.data;
    },
    resetSecret: async (id: string): Promise<void> => {
      await api.post(`/manager/applications/${id}/reset-secret`);
    },
  },

  sales: {
    // No sales endpoints defined for manager
  },
};
