/**
 * src/config/constants.ts
 *
 * App-wide constants. Keep this file short — it's for truly global,
 * environment-independent values only.
 */

export const APP_VERSION = '1.0.0';

/** Minimum iOS/Android OS version we target (informational, matches native config). */
export const MIN_IOS_VERSION = '16.0';
export const MIN_ANDROID_SDK = 24;

/** AsyncStorage keys — single source of truth, prevents typos. */
export const STORAGE_KEYS = {
  HAS_ONBOARDED: '@rnboilerplate/has_onboarded',
  THEME_PREFERENCE: '@rnboilerplate/theme',
  USER_LOCALE: '@rnboilerplate/locale',
} as const;

/** Timing constants (ms) */
export const SPLASH_MIN_DISPLAY_MS = 1500;
export const API_TIMEOUT_MS = 15_000;
export const TOKEN_REFRESH_MARGIN_S = 60; // refresh token this many seconds before expiry
