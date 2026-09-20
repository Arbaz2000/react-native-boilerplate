/**
 * src/services/storage/secureStorage.ts
 *
 * Hardware-backed secure storage wrapper around react-native-keychain
 * (iOS Keychain & Android KeyStore).
 *
 * Spec §2 line 121, §6:
 *   - Used for sensitive secrets: JWT access/refresh tokens, encryption keys
 *   - Never store plain secrets or API tokens in AsyncStorage or .env files
 */

import * as Keychain from 'react-native-keychain';

const KEYCHAIN_OPTIONS: Keychain.SetOptions = {
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const DEFAULT_SERVICE = 'com.arbaz.rnboilerplate.secure';
const TOKEN_SERVICE = 'com.arbaz.rnboilerplate.tokens';

/**
 * Save a key-value secret to secure hardware storage.
 */
export async function saveSecureItem(
  key: string,
  value: string,
  service: string = DEFAULT_SERVICE,
): Promise<boolean> {
  try {
    const result = await Keychain.setGenericPassword(key, value, {
      ...KEYCHAIN_OPTIONS,
      service,
    });
    return Boolean(result);
  } catch (error) {
    console.warn(`[secureStorage] Failed to save key "${key}":`, error);
    return false;
  }
}

/**
 * Retrieve a secret by key from secure hardware storage.
 */
export async function getSecureItem(
  key: string,
  service: string = DEFAULT_SERVICE,
): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service,
    });
    if (credentials && credentials.username === key) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.warn(`[secureStorage] Failed to get key "${key}":`, error);
    return null;
  }
}

/**
 * Remove a secret from secure hardware storage.
 */
export async function removeSecureItem(
  service: string = DEFAULT_SERVICE,
): Promise<boolean> {
  try {
    return await Keychain.resetGenericPassword({ service });
  } catch (error) {
    console.warn(`[secureStorage] Failed to reset service "${service}":`, error);
    return false;
  }
}

/**
 * Save JWT tokens to the dedicated token service.
 * Username stores accessToken, Password stores refreshToken.
 */
export async function saveAuthTokens(
  accessToken: string,
  refreshToken: string,
): Promise<boolean> {
  try {
    const result = await Keychain.setGenericPassword(
      accessToken,
      refreshToken,
      {
        ...KEYCHAIN_OPTIONS,
        service: TOKEN_SERVICE,
      },
    );
    return Boolean(result);
  } catch (error) {
    console.warn('[secureStorage] Failed to save auth tokens:', error);
    return false;
  }
}

/**
 * Retrieve JWT tokens from dedicated token service.
 */
export async function getAuthTokens(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_SERVICE,
    });
    if (credentials) {
      return {
        accessToken: credentials.username,
        refreshToken: credentials.password,
      };
    }
    return null;
  } catch (error) {
    console.warn('[secureStorage] Failed to get auth tokens:', error);
    return null;
  }
}

/**
 * Clear JWT tokens from dedicated token service.
 */
export async function clearAuthTokens(): Promise<boolean> {
  try {
    return await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
  } catch (error) {
    console.warn('[secureStorage] Failed to clear auth tokens:', error);
    return false;
  }
}
