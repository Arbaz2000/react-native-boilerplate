import { ENDPOINTS, replaceParams } from '../src/services/api/endpoints';
import {
  saveSecureItem,
  getSecureItem,
  saveAuthTokens,
  getAuthTokens,
  clearAuthTokens,
} from '../src/services/storage/secureStorage';
import {
  setItem,
  getItem,
  removeItem,
  multiGet,
} from '../src/services/storage/asyncStorage';
import {
  encryptPayload,
  decryptPayload,
  generateRandomNonce,
  simpleHash,
} from '../src/services/encryption/crypto';
import {
  compareVersions,
  isLessThan,
  isGreaterThan,
  isAtLeast,
} from '../src/services/version/versionComparator';

describe('Phase F Services Unit Tests', () => {
  describe('Endpoints & Param Replacement', () => {
    it('defines standard endpoint paths', () => {
      expect(ENDPOINTS.AUTH.LOGIN).toBe('/auth/login');
      expect(ENDPOINTS.AUTH.REFRESH).toBe('/auth/refresh');
      expect(ENDPOINTS.CONFIG.APP).toBe('/config/app');
    });

    it('interpolates path parameters correctly', () => {
      const template = '/users/:userId/orders/:orderId';
      const result = replaceParams(template, { userId: 'usr_42', orderId: 101 });
      expect(result).toBe('/users/usr_42/orders/101');
    });
  });

  describe('Secure Storage (Keychain wrapper)', () => {
    it('saves and retrieves arbitrary secure items', async () => {
      const saved = await saveSecureItem('apiKey', 'sec_token_999');
      expect(saved).toBe(true);

      const retrieved = await getSecureItem('apiKey');
      expect(retrieved).toBe('sec_token_999');
    });

    it('saves, retrieves, and clears dedicated auth tokens', async () => {
      await saveAuthTokens('access_jwt_123', 'refresh_jwt_456');

      const tokens = await getAuthTokens();
      expect(tokens).toEqual({
        accessToken: 'access_jwt_123',
        refreshToken: 'refresh_jwt_456',
      });

      await clearAuthTokens();
      const cleared = await getAuthTokens();
      expect(cleared).toBeNull();
    });
  });

  describe('AsyncStorage Typed Helpers', () => {
    it('stores and retrieves JSON objects', async () => {
      const payload = { theme: 'dark', notificationsEnabled: true };
      await setItem('user_prefs', payload);

      const retrieved = await getItem<typeof payload>('user_prefs');
      expect(retrieved).toEqual(payload);
    });

    it('returns fallback value when item is missing', async () => {
      const missing = await getItem('non_existent_key', { defaultVal: true });
      expect(missing).toEqual({ defaultVal: true });
    });

    it('removes items and performs multiGet', async () => {
      await setItem('key1', 'val1');
      await setItem('key2', 'val2');

      const multi = await multiGet(['key1', 'key2']);
      expect(multi.key1).toBe('val1');
      expect(multi.key2).toBe('val2');

      await removeItem('key1');
      const afterRemove = await getItem('key1');
      expect(afterRemove).toBeNull();
    });
  });

  describe('Crypto Payload Encryption Stub', () => {
    it('encrypts and decrypts object payloads identically', async () => {
      const original = { accountId: 'acc_77', balance: 5400.5, active: true };
      const encrypted = await encryptPayload(original);
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toEqual(JSON.stringify(original));

      const decrypted = await decryptPayload<typeof original>(encrypted);
      expect(decrypted).toEqual(original);
    });

    it('generates random nonces of requested length', () => {
      const nonce1 = generateRandomNonce(16);
      const nonce2 = generateRandomNonce(16);
      expect(nonce1).toHaveLength(16);
      expect(nonce2).toHaveLength(16);
      expect(nonce1).not.toBe(nonce2);
    });

    it('produces deterministic hashes', () => {
      const hash1 = simpleHash('boilerplate-secret');
      const hash2 = simpleHash('boilerplate-secret');
      const hash3 = simpleHash('different-secret');
      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
    });
  });

  describe('Version Comparator (Semver)', () => {
    it('evaluates greater than, less than, and equality', () => {
      expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
      expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
      expect(compareVersions('1.5.0', '1.5.0')).toBe(0);

      expect(isLessThan('1.0.0', '1.0.1')).toBe(true);
      expect(isLessThan('1.2.0', '1.1.9')).toBe(false);

      expect(isGreaterThan('2.1.0', '2.0.9')).toBe(true);
      expect(isAtLeast('1.0.0', '1.0.0')).toBe(true);
      expect(isAtLeast('1.0.1', '1.0.0')).toBe(true);
    });
  });
});
