import axios from 'axios';
import { ClientIntake, ApiResponse, PaginatedResponse, Statistics } from '../types';
import { API_BASE_URL } from './apiConfig';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle specific error cases
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot connect to backend API at', API_BASE_URL);
    }
    
    return Promise.reject(error);
  }
);

export const clientIntakeApi = {
  // Submit new client intake
  create: async (data: ClientIntake): Promise<ApiResponse<ClientIntake>> => {
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

export const statsApi = {
  // Get statistics data
  getStats: async (): Promise<ApiResponse<Statistics>> => {
    const response = await api.get('/stats');
    return response.data;
  }
};

export const exportApi = {
  // Export single client to Excel
  exportExcel: async (id: string): Promise<Blob> => {
    const response = await api.get(`/export/excel/${id}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export all clients to Excel
  exportAllExcel: async (): Promise<Blob> => {
    const response = await api.get('/export/excel-all', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export single client to CSV
  exportCsv: async (id: string): Promise<Blob> => {
    const response = await api.get(`/export/csv/${id}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export all clients to CSV
  exportAllCsv: async (): Promise<Blob> => {
    const response = await api.get('/export/csv-all', {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Utility function to download file
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default api;
