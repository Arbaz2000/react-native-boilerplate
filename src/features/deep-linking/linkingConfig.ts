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
 *
 * Phase C: Add `LinkingOptions<RootStackParamList>` type from @react-navigation/native
 * and fill in the `screens` map once all navigators are wired.
 */

/** Custom URL scheme — change this and the native manifest/plist entries together. */
export const DEEP_LINK_SCHEME = 'rnboilerplate';

/**
 * Phase A stub — upgraded to typed LinkingOptions in Phase C.
 * The `prefixes` and `screens` map are the two things you edit here per client.
 */
export const linkingConfig = {
  prefixes: [
    `${DEEP_LINK_SCHEME}://`,
    // Add Universal Link domain here when configured, e.g.:
    // 'https://yourdomain.com',
  ],
  config: {
    screens: {
      // Populated in Phase C once navigators are defined.
      // Example:
      // Auth: { screens: { Login: 'login' } },
      // Home: 'home',
    } as Record<string, unknown>,
  },
};
