import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://analysis-app-ruud.onrender.com/api';
const SESSION_COOKIE_NAME = 'analysis_session_id';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include session ID
axiosInstance.interceptors.request.use((config) => {
  const sessionId = Cookies.get(SESSION_COOKIE_NAME);
  if (sessionId) {
    config.params = {
      ...config.params,
      session_id: sessionId
    };
  }
  return config;
});

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, string>;
}

async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { data, headers, params } = options;

  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || 'GET',
      data,
      params,
      headers: {
        ...headers,
        ...(data instanceof FormData ? { 'Content-Type': undefined } : {}),
      },
    });

    // Handle session ID from response if present
    if (response.data?.session_id) {
      Cookies.set(SESSION_COOKIE_NAME, response.data.session_id, { 
        expires: 7, // Cookie expires in 7 days
        secure: true,
        sameSite: 'strict'
      });
    }

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