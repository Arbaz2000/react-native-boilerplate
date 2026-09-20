/**
 * src/features/app-config/app-config.slice.ts
 *
 * Redux Toolkit slice managing cached application configuration,
 * active feature flags, and maintenance mode status.
 * Spec §2 line 105: app-config.slice.ts
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { remoteConfigApi } from './remote-config.api';
import type { AppConfigState, RemoteAppConfig } from './app-config.types';

const initialState: AppConfigState = {
  minSupportedVersion: '1.0.0',
  latestVersion: '1.0.0',
  maintenanceMode: false,
  maintenanceMessage: null,
  featureFlags: {},
  isInitialized: false,
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setRemoteConfig: (state, action: PayloadAction<RemoteAppConfig>) => {
      state.minSupportedVersion = action.payload.minSupportedVersion;
      state.latestVersion = action.payload.latestVersion;
      state.maintenanceMode = action.payload.maintenanceMode;
      state.maintenanceMessage = action.payload.maintenanceMessage ?? null;
      state.featureFlags = action.payload.featureFlags;
      state.isInitialized = true;
    },

    setFeatureFlag: (
      state,
      action: PayloadAction<{ key: string; enabled: boolean }>,
    ) => {
      state.featureFlags[action.payload.key] = action.payload.enabled;
    },

    setMaintenanceMode: (
      state,
      action: PayloadAction<{ enabled: boolean; message?: string }>,
    ) => {
      state.maintenanceMode = action.payload.enabled;
      state.maintenanceMessage = action.payload.message ?? null;
    },

    resetAppConfig: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      remoteConfigApi.endpoints.getRemoteConfig.matchFulfilled,
      (state, { payload }) => {
        state.minSupportedVersion = payload.minSupportedVersion;
        state.latestVersion = payload.latestVersion;
        state.maintenanceMode = payload.maintenanceMode;
        state.maintenanceMessage = payload.maintenanceMessage ?? null;
        state.featureFlags = payload.featureFlags;
        state.isInitialized = true;
      },
    );
  },
});

export const {
  setRemoteConfig,
  setFeatureFlag,
  setMaintenanceMode,
  resetAppConfig,
} = appConfigSlice.actions;

export default appConfigSlice.reducer;
