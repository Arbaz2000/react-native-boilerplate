/**
 * src/features/auth/auth.api.ts
 *
 * RTK Query API slice for authentication endpoints.
 * Spec §2 line 97: auth.api.ts handles login, signup, refresh, profile fetches.
 *
 * Automatically bridges successful token receipts to useAuthStore.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '@/config/env';
import { useAuthStore } from './auth.slice';
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  SignupCredentials,
  SignupResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './auth.types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: env.apiBaseUrl || 'https://api.example.com',
    prepareHeaders: (headers) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          useAuthStore.getState().setSession(data.tokens, data.user);
        } catch {
          // Handled by UI caller
        }
      },
    }),

    signup: builder.mutation<SignupResponse, SignupCredentials>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          useAuthStore.getState().setSession(data.tokens, data.user);
        } catch {
          // Handled by UI caller
        }
      },
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (payload) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          useAuthStore.getState().setAccessToken(data.tokens.accessToken);
        } catch {
          // Token refresh failure -> logout
          useAuthStore.getState().logout();
        }
      },
    }),

    getProfile: builder.query<AuthUser, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          useAuthStore.getState().setUser(data);
        } catch {
          // Ignore profile sync error
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          useAuthStore.getState().logout();
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;
