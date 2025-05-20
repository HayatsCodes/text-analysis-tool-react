import axios from 'axios';

const BASE_URL = 'https://analysis-app-ruud.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  data?: any;
}

async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { data, headers } = options;

  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || 'GET',
      data,
      headers: {
        ...headers,
        ...(data instanceof FormData ? { 'Content-Type': undefined } : {}),
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data: any } };
    if (axiosError.response) {
      return Promise.reject(axiosError.response.data);
    }
    return Promise.reject(error);
  }
}

export const api = {
  get: (endpoint: string, options?: FetchOptions) => 
    fetchApi(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, data?: any, options?: FetchOptions) => 
    fetchApi(endpoint, { ...options, method: 'POST', data }),
  
  put: (endpoint: string, data?: any, options?: FetchOptions) => 
    fetchApi(endpoint, { ...options, method: 'PUT', data }),
  
  delete: (endpoint: string, options?: FetchOptions) => 
    fetchApi(endpoint, { ...options, method: 'DELETE' }),
}; 