import axios from 'axios';
import { ClientIntake, ApiResponse, PaginatedResponse } from '../types';
import { API_BASE_URL } from './apiConfig';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug: Log all requests and responses
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  console.log('🔍 API Request Debug:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    hasToken: !!token,
    token: token ? `${token.substring(0, 20)}...` : 'none',
    headers: config.headers
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown'
    });
    return Promise.reject(error);
  }
);

export const clientIntakeApi = {
  // Submit new client intake
  create: async (data: ClientIntake): Promise<ApiResponse<ClientIntake>> => {
    console.log('📝 Creating client intake with data:', data);
    const response = await api.post('/intake', data);
    return response.data;
  },

  // Get all client intakes with filtering
  getAll: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    service?: string;
    taxType?: string;
    ramisStatus?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<ClientIntake>> => {
    const response = await api.get('/intake', { params });
    return response.data;
  },

  // Get single client intake
  getById: async (id: string): Promise<ApiResponse<ClientIntake>> => {
    const response = await api.get(`/intake/${id}`);
    return response.data;
  },

  // Update client intake
  update: async (id: string, data: Partial<ClientIntake>): Promise<ApiResponse<ClientIntake>> => {
    const response = await api.put(`/intake/${id}`, data);
    return response.data;
  },

  // Delete client intake
  delete: async (id: string, passcode: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/intake/${id}`, {
      data: { passcode }
    });
    return response.data;
  }
};

export default api;
