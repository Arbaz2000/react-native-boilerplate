/**
 * Type declarations for react-native-config.
 * Add every key from your .env.* files here.
 * Access values through src/config/env.ts — never read Config directly in feature code.
 */
declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ENV: 'development' | 'staging' | 'production';
    API_BASE_URL: string;
    REMOTE_CONFIG_URL: string;
    FEATURE_ONBOARDING: string; // '1' | '0'  — parse to boolean in env.ts
    FEATURE_FORCE_UPDATE: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
