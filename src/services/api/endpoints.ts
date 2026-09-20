/**
 * src/services/api/endpoints.ts
 *
 * Single source of truth for all API endpoint URLs.
 * Spec §2 line 119: endpoints.ts
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  CONFIG: {
    APP: '/config/app',
    FEATURES: '/config/features',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/account',
  },
  NOTIFICATIONS: {
    REGISTER_DEVICE: '/notifications/register-device',
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },
} as const;

/**
 * Utility to replace path parameters in dynamic endpoints.
 * @example replaceParams('/users/:id/posts/:postId', { id: '12', postId: '99' })
 */
export function replaceParams(
  endpoint: string,
  params: Record<string, string | number>,
): string {
  let result = endpoint;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, encodeURIComponent(String(value)));
  }
  return result;
}
