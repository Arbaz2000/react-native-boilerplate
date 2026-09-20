/**
 * src/mocks/handlers.ts
 *
 * Mock Service Worker (MSW) REST handlers.
 * Intercepts network requests for offline development, review demos, and automated testing.
 */

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth: Login
  http.post('*/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === 'invalid@example.com') {
      return HttpResponse.json(
        {
          message: 'Invalid credentials provided.',
          code: 'AUTH_INVALID_CREDENTIALS',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      user: {
        id: 'usr_mock_123',
        email: body.email || 'demo@example.com',
        name: 'Demo Reviewer',
        role: 'admin',
      },
      tokens: {
        accessToken: 'mock_jwt_access_token_xyz',
        refreshToken: 'mock_jwt_refresh_token_xyz',
        expiresIn: 3600,
      },
    });
  }),

  // Auth: Signup
  http.post('*/auth/signup', async ({ request }) => {
    const body = (await request.json()) as { email?: string; name?: string };

    return HttpResponse.json(
      {
        user: {
          id: 'usr_mock_new',
          email: body.email || 'newuser@example.com',
          name: body.name || 'New User',
          role: 'user',
        },
        tokens: {
          accessToken: 'mock_jwt_access_new_xyz',
          refreshToken: 'mock_jwt_refresh_new_xyz',
          expiresIn: 3600,
        },
      },
      { status: 201 },
    );
  }),

  // Auth: Refresh Token
  http.post('*/auth/refresh', async () => {
    return HttpResponse.json({
      accessToken: 'mock_jwt_access_refreshed_999',
      expiresIn: 3600,
    });
  }),

  // Auth: Current User Profile
  http.get('*/auth/me', async () => {
    return HttpResponse.json({
      id: 'usr_mock_123',
      email: 'demo@example.com',
      name: 'Demo Reviewer',
      role: 'admin',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  }),

  // App Config: Remote Configuration & Feature Flags
  http.get('*/config/app', async () => {
    return HttpResponse.json({
      minSupportedVersion: '1.0.0',
      latestVersion: '1.0.0',
      featureFlags: {
        enableBetaFeatures: false,
        enableBiometrics: true,
        enableNewDashboard: true,
      },
      maintenanceMode: false,
    });
  }),
];
