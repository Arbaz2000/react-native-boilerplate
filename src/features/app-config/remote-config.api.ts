/**
 * src/features/app-config/remote-config.api.ts
 *
 * RTK Query API slice for fetching remote configuration,
 * minimum supported versions, and feature flags.
 * Spec §2 line 104, §5: remote-config.api.ts
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '@/config/env';
import type { RemoteAppConfig } from './app-config.types';

export const remoteConfigApi = createApi({
  reducerPath: 'remoteConfigApi',
  baseQuery: fetchBaseQuery({
    baseUrl: env.remoteConfigUrl || env.apiBaseUrl || 'https://api.example.com',
  }),
  tagTypes: ['RemoteConfig'],
  endpoints: (builder) => ({
    getRemoteConfig: builder.query<RemoteAppConfig, void>({
      query: () => ({
        url: '/config/app',
        method: 'GET',
      }),
      providesTags: ['RemoteConfig'],
    }),

    getFeatureFlag: builder.query<boolean, string>({
      query: (flagKey) => ({
        url: `/config/features/${flagKey}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetRemoteConfigQuery, useGetFeatureFlagQuery } = remoteConfigApi;
