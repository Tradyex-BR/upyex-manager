import api from './api';

const EXTERNAL_BASE = '/external';
const applicationApiKey = import.meta.env.VITE_APPLICATION_API_KEY || '';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  amount: number;
}

export interface RegisterSalePayload {
  id: string;
  customer_id: string;
  type: string;
  status: string;
  payment_method: string;
  products: ProductItem[];
  platform_fee: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateSalePayload {
  status: string;
}

export interface RegisterCustomerPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  document_number: string | null;
  affiliate_code: string;
}

export interface UpdateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  document_number: string;
}

export const externalService = {
  sales: {
    register: async (payload: RegisterSalePayload): Promise<any> => {
      const response = await api.post(`${EXTERNAL_BASE}/sales`, payload, {
        headers: { 'X-Api-Key': applicationApiKey },
      });
      return response.data;
    },
    update: async (id: string, payload: UpdateSalePayload): Promise<any> => {
      const response = await api.post(`${EXTERNAL_BASE}/sales/${id}`, payload, {
        headers: { 'X-Api-Key': applicationApiKey },
      });
      return response.data;
    },
  },

  customers: {
    register: async (payload: RegisterCustomerPayload): Promise<any> => {
      const response = await api.post(`${EXTERNAL_BASE}/customers`, payload, {
        headers: { 'X-Api-Key': applicationApiKey },
      });
      return response.data;
    },
    update: async (id: string, payload: UpdateCustomerPayload): Promise<any> => {
      const response = await api.post(`${EXTERNAL_BASE}/customers/${id}`, payload, {
        headers: { 'X-Api-Key': applicationApiKey },
      });
      return response.data;
    },
    delete: async (id: string): Promise<any> => {
      const response = await api.delete(`${EXTERNAL_BASE}/customers/${id}`, {
        headers: { 'X-Api-Key': applicationApiKey },
      });
      return response.data;
    },
  },
};
