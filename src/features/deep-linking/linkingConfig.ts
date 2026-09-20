/**
 * src/features/deep-linking/linkingConfig.ts
 *
 * ─────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for deep link scheme.
 *
 * When cloning for a new client:
 *   1. Replace DEEP_LINK_SCHEME with the client's custom scheme.
 *   2. Update android/app/src/main/AndroidManifest.xml <intent-filter>
 *   3. Update ios/RNFreelanceBoilerplate/Info.plist CFBundleURLSchemes
 *   4. If using Universal Links / App Links, update your
 *      apple-app-site-association / assetlinks.json on the client domain.
 * ─────────────────────────────────────────────────────────────
 */

import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

/** Custom URL scheme — change this and the native manifest/plist entries together. */
export const DEEP_LINK_SCHEME = 'rnboilerplate';

/**
 * React Navigation deep linking configuration.
 * Maps URL paths to screens and nested stacks.
 */
export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: [
    `${DEEP_LINK_SCHEME}://`,
    // Universal Links / App Links domain placeholder:
    // 'https://example.com/app',
  ],
  config: {
    screens: {
      Splash: 'splash',
      Onboarding: {
        screens: {
          Welcome: 'welcome',
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Signup: 'signup',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Dashboard: 'dashboard',
          Explore: 'explore',
          Chat: 'chat',
          Settings: 'settings',
        },
      },
      UpdateRequired: 'update-required',
    },
  },
};
