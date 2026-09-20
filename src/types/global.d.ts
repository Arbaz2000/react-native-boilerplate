/**
 * src/types/global.d.ts
 *
 * Global TypeScript ambient declarations.
 * Keep this file minimal — prefer co-located types in feature files.
 */

// Ensure this file is treated as a module
export {};

declare global {
  /** Convenience alias for React children */
  type ReactChildren = import('react').ReactNode;

  /** Any JSON-serializable value */
  type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

  /** Utility: make all properties (including nested) optional */
  type DeepPartial<T> = T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

  /** Utility: make all properties (including nested) required */
  type DeepRequired<T> = T extends object
    ? { [P in keyof T]-?: DeepRequired<T[P]> }
    : T;
}
