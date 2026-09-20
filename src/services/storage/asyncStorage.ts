/**
 * src/services/storage/asyncStorage.ts
 *
 * Strongly-typed wrapper around @react-native-async-storage/async-storage.
 * Spec §2 line 122: Non-sensitive persisted preferences, cached queries, flags.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Retrieve and deserialize a value from AsyncStorage.
 */
export async function getItem<T = unknown>(
  key: string,
  fallback: T | null = null,
): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[asyncStorage] Error reading key "${key}":`, error);
    return fallback;
  }
}

/**
 * Serialize and store a value in AsyncStorage.
 */
export async function setItem<T = unknown>(
  key: string,
  value: T,
): Promise<boolean> {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn(`[asyncStorage] Error saving key "${key}":`, error);
    return false;
  }
}

/**
 * Remove an item from AsyncStorage.
 */
export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[asyncStorage] Error removing key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all items from AsyncStorage.
 */
export async function clearAll(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.warn('[asyncStorage] Error clearing storage:', error);
    return false;
  }
}

/**
 * Retrieve all keys stored in AsyncStorage.
 */
export async function getAllKeys(): Promise<readonly string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.warn('[asyncStorage] Error fetching all keys:', error);
    return [];
  }
}

/**
 * Retrieve multiple items by keys at once.
 */
export async function multiGet<T = unknown>(
  keys: string[],
): Promise<Record<string, T | null>> {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, T | null> = {};
    for (const [key, value] of pairs) {
      if (value !== null) {
        try {
          result[key] = JSON.parse(value) as T;
        } catch {
          result[key] = value as unknown as T;
        }
      } else {
        result[key] = null;
      }
    }
    return result;
  } catch (error) {
    console.warn('[asyncStorage] Error multiGet:', error);
    return {};
  }
}
