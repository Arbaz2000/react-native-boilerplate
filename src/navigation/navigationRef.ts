/**
 * src/navigation/navigationRef.ts
 *
 * Global navigation ref — allows navigation from outside React components
 * (e.g. in Axios interceptors, background tasks, deep link handlers).
 *
 * Phase C: Once @react-navigation/native is installed, replace this file with:
 *
 * ```ts
 * import { createNavigationContainerRef } from '@react-navigation/native';
 * import type { RootStackParamList } from './types';
 *
 * export const navigationRef = createNavigationContainerRef<RootStackParamList>();
 *
 * export function navigate(
 *   name: keyof RootStackParamList,
 *   params?: RootStackParamList[keyof RootStackParamList],
 * ) {
 *   if (navigationRef.isReady()) {
 *     navigationRef.navigate(name as never, params as never);
 *   }
 * }
 * ```
 */

// Phase A stub — @react-navigation/native installed in Phase C
export const navigationRef = null;
export function navigate(_name: string, _params?: unknown): void {
  // stub
}
