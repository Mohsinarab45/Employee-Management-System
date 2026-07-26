import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 4000, // Reduced to 4 seconds for fast load
    });

    // JWT Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('ems_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Global Error Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (typeof window !== 'undefined') {
          const isLoggingOut = localStorage.getItem('ems_logging_out') === 'true';
          const isLoginPage = window.location.pathname === '/login';
          const status = error.response?.status;

          // Suppress false-positive toasts during intentional logout or on login page
          if (status === 401 && (isLoggingOut || isLoginPage)) {
            return Promise.reject(error);
          }

          const errorMessage =
            error.response?.data?.message ||
            (error.code === 'ECONNABORTED'
              ? 'Server request timed out'
              : 'Network communication error');

          // Dispatch custom event for global UI toast handling
          window.dispatchEvent(
            new CustomEvent('ems_api_error', { detail: { message: errorMessage } })
          );
        }
        return Promise.reject(error);
      }
    );
  }

  // Unified Request Methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
