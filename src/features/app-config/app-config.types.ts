/**
 * src/features/app-config/app-config.types.ts
 *
 * Types for remote app configuration, version constraints, and feature flags.
 */

export type RemoteAppConfig = {
  minSupportedVersion: string;
  latestVersion: string;
  storeUrl: {
    ios: string;
    android: string;
  };
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  featureFlags: Record<string, boolean>;
};

export type AppConfigState = {
  minSupportedVersion: string;
  latestVersion: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  featureFlags: Record<string, boolean>;
  isInitialized: boolean;
};
