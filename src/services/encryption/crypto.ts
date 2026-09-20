/**
 * src/services/encryption/crypto.ts
 *
 * Payload Encryption & Hashing Stub.
 * Spec §2 line 124, §6:
 *   - "stub-but-ready AES wrapper — plug in a real key exchange when a
 *      client's backend needs encrypted payloads, without touching the rest of the app."
 *   - Provides consistent encrypt/decrypt interfaces ready for native AES-256-GCM
 *     (e.g., react-native-quick-crypto or WebCrypto) when required by client backend.
 */

const BASE64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * Pure TypeScript Base64 encode utility compatible with all React Native JS engines.
 */
function toBase64(input: string): string {
  const utf8Bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    let charcode = input.charCodeAt(i);
    if (charcode < 0x80) {
      utf8Bytes.push(charcode);
    } else if (charcode < 0x800) {
      utf8Bytes.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8Bytes.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    } else {
      i++;
      const nextChar = input.charCodeAt(i) ?? 0;
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (nextChar & 0x3ff));
      utf8Bytes.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
  }

  let output = '';
  let i = 0;
  while (i < utf8Bytes.length) {
    const b1 = utf8Bytes[i++] ?? 0;
    const hasB2 = i < utf8Bytes.length;
    const b2 = hasB2 ? (utf8Bytes[i++] ?? 0) : 0;
    const hasB3 = i < utf8Bytes.length;
    const b3 = hasB3 ? (utf8Bytes[i++] ?? 0) : 0;

    const enc1 = b1 >> 2;
    const enc2 = ((b1 & 3) << 4) | (b2 >> 4);
    const enc3 = hasB2 ? ((b2 & 15) << 2) | (b3 >> 6) : 64;
    const enc4 = hasB3 ? b3 & 63 : 64;

    output +=
      BASE64_CHARS.charAt(enc1) +
      BASE64_CHARS.charAt(enc2) +
      BASE64_CHARS.charAt(enc3) +
      BASE64_CHARS.charAt(enc4);
  }

  return output;
}

/**
 * Pure TypeScript Base64 decode utility compatible with all React Native JS engines.
 */
function fromBase64(input: string): string {
  const cleanInput = input.replace(/[^A-Za-z0-9+/=]/g, '');
  const bytes: number[] = [];
  let i = 0;

  while (i < cleanInput.length) {
    const enc1 = BASE64_CHARS.indexOf(cleanInput.charAt(i++) || '');
    const enc2 = BASE64_CHARS.indexOf(cleanInput.charAt(i++) || '');
    const enc3 = BASE64_CHARS.indexOf(cleanInput.charAt(i++) || '');
    const enc4 = BASE64_CHARS.indexOf(cleanInput.charAt(i++) || '');

    if (enc1 === -1 || enc2 === -1) {
      break;
    }

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    bytes.push(chr1);

    if (enc3 !== 64 && enc3 !== -1) {
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      bytes.push(chr2);
    }
    if (enc4 !== 64 && enc4 !== -1) {
      const chr3 = ((enc3 & 3) << 6) | enc4;
      bytes.push(chr3);
    }
  }

  let output = '';
  let idx = 0;
  while (idx < bytes.length) {
    const b1 = bytes[idx++];
    if (b1 === undefined) {
      break;
    }
    if (b1 < 0x80) {
      output += String.fromCharCode(b1);
    } else if (b1 > 0xbf && b1 < 0xe0) {
      const b2 = bytes[idx++] ?? 0;
      output += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f));
    } else if (b1 >= 0xe0 && b1 < 0xf0) {
      const b2 = bytes[idx++] ?? 0;
      const b3 = bytes[idx++] ?? 0;
      output += String.fromCharCode(
        ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f),
      );
    } else {
      const b2 = bytes[idx++] ?? 0;
      const b3 = bytes[idx++] ?? 0;
      const b4 = bytes[idx++] ?? 0;
      let codepoint =
        ((b1 & 0x07) << 18) |
        ((b2 & 0x3f) << 12) |
        ((b3 & 0x3f) << 6) |
        (b4 & 0x3f);
      codepoint -= 0x10000;
      output += String.fromCharCode(
        0xd800 + (codepoint >> 10),
        0xdc00 + (codepoint & 0x3ff),
      );
    }
  }

  return output;
}

/**
 * Encrypt a plain JavaScript object or string payload.
 * In this boilerplate baseline, packages a JSON structure with base64 encoding.
 * When client requires real AES-256-GCM, swap the cipher logic here without
 * altering any consuming features!
 */
export async function encryptPayload(
  payload: unknown,
  _secretKey?: string,
): Promise<string> {
  const jsonString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  // Baseline encoding container; swap with AES-GCM cipher when secretKey exchange is configured
  return toBase64(jsonString);
}

/**
 * Decrypt an encrypted string payload back into a typed JavaScript object.
 */
export async function decryptPayload<T = unknown>(
  cipherText: string,
  _secretKey?: string,
): Promise<T> {
  const decodedString = fromBase64(cipherText);
  try {
    return JSON.parse(decodedString) as T;
  } catch {
    return decodedString as unknown as T;
  }
}

/**
 * Generates a random cryptographic nonce or key placeholder.
 */
export function generateRandomNonce(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Fast string hashing utility (FNV-1a 32-bit hash representation).
 */
export function simpleHash(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16);
}
