/**
 * src/services/api/interceptors.ts
 *
 * Axios Request & Response Interceptors.
 * Spec §2 line 118:
 *   - Injects Auth Bearer token into outgoing requests
 *   - Injects platform & app version telemetry headers
 *   - Queues concurrent failed requests during 401 token refresh
 *   - Auto-refreshes token via refresh endpoint
 *   - Auto-logs out and redirects to Auth on refresh expiration
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '@/features/auth/auth.slice';
import { resetRoot } from '@/navigation/navigationRef';
import { APP_VERSION } from '@/config/constants';
import { ENDPOINTS } from './endpoints';
import env from '@/config/env';

export type ApiError = {
  message: string;
  status?: number | undefined;
  code?: string | undefined;
  errors?: Record<string, string[]> | undefined;
};

// Queue state for 401 token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

/**
 * Attaches request and response interceptors to an Axios instance.
 */
export function setupInterceptors(client: AxiosInstance): void {
  // ── 1. Request Interceptor ─────────────────────────────
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = useAuthStore.getState().accessToken;

      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (config.headers) {
        config.headers['X-App-Version'] = APP_VERSION;
        config.headers['X-Platform'] = Platform.OS;
        config.headers['Accept'] = 'application/json';
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // ── 2. Response Interceptor ────────────────────────────
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (!originalRequest) {
        return Promise.reject(formatError(error));
      }

      const status = error.response?.status;
      const isAuthUrl =
        originalRequest.url?.includes(ENDPOINTS.AUTH.LOGIN) ||
        originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH);

      // Check for 401 Unauthorized and not already retried or auth route
      if (status === 401 && !originalRequest._retry && !isAuthUrl) {
        if (isRefreshing) {
          // Another request is already refreshing the token: wait in queue
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const currentRefreshToken = useAuthStore.getState().refreshToken;

        if (!currentRefreshToken) {
          isRefreshing = false;
          useAuthStore.getState().logout();
          resetRoot('Auth');
          return Promise.reject(formatError(error));
        }

        try {
          // Perform refresh token exchange
          const refreshResponse = await axios.post(
            `${env.apiBaseUrl || 'https://api.example.com'}${ENDPOINTS.AUTH.REFRESH}`,
            { refreshToken: currentRefreshToken },
            { headers: { 'Content-Type': 'application/json' } },
          );

          const newAccessToken = refreshResponse.data?.tokens?.accessToken;
          const newRefreshToken =
            refreshResponse.data?.tokens?.refreshToken || currentRefreshToken;

          if (!newAccessToken) {
            throw new Error('No access token returned from refresh endpoint');
          }

          // Update store with fresh tokens
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            useAuthStore.getState().setSession(
              {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              },
              currentUser,
            );
          } else {
            useAuthStore.getState().setAccessToken(newAccessToken);
          }

          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return client(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          useAuthStore.getState().logout();
          resetRoot('Auth');
          return Promise.reject(formatError(refreshErr as AxiosError));
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(formatError(error));
    },
  );
}

/**
 * Standardizes raw Axios / network errors into typed ApiError objects.
 */
export function formatError(error: AxiosError | any): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    return {
      message:
        data?.message ||
        data?.error ||
        error.message ||
        'An unexpected server error occurred.',
      status: error.response?.status,
      code: data?.code || error.code,
      errors: data?.errors,
    };
  }

  return {
    message: error?.message || 'An unknown network error occurred.',
  };
}
