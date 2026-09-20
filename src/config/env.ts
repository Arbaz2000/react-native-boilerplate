/**
 * src/config/env.ts
 *
 * Typed wrapper around react-native-config.
 * This is the ONLY place in the codebase that reads `Config` directly.
 * All feature code imports from here — never from react-native-config directly.
 */

import Config from 'react-native-config';

const env = {
  appEnv: Config.APP_ENV ?? 'development',
  apiBaseUrl: Config.API_BASE_URL ?? '',
  remoteConfigUrl: Config.REMOTE_CONFIG_URL ?? '',
  featureOnboarding: Config.FEATURE_ONBOARDING === '1',
  featureForceUpdate: Config.FEATURE_FORCE_UPDATE === '1',
  isDevelopment: (Config.APP_ENV ?? 'development') === 'development',
  isStaging: Config.APP_ENV === 'staging',
  isProduction: Config.APP_ENV === 'production',
} as const;

export default env;
