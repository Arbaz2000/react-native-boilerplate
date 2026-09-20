/**
 * src/services/api/apiClient.ts
 *
 * Configured Axios HTTP client instance with interceptors and typed helpers.
 * Spec §2 line 117: apiClient.ts
 */

import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import env from '@/config/env';
import { API_TIMEOUT_MS } from '@/config/constants';
import { setupInterceptors } from './interceptors';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl || 'https://api.example.com',
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth injection, platform headers, and 401 retry queue
setupInterceptors(apiClient);

/**
 * Typed API convenience wrappers extracting response.data automatically.
 */
export const http = {
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  },

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  },

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  },

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
    return response.data;
  },

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  },
};

export default apiClient;
