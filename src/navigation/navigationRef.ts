/**
 * src/navigation/navigationRef.ts
 *
 * Global navigation ref — allows navigation from outside React components
 * (e.g. in Axios interceptors, background tasks, deep link handlers, push notifications).
 */

import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigate to a root screen or nested stack from outside React components.
 */
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
): void {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
  }
}

/**
 * Reset the navigation state to a single top-level route.
 * Useful for logout, force update, or after onboarding completion.
 */
export function resetRoot(name: keyof RootStackParamList): void {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({
      index: 0,
      routes: [{ name }],
    });
  }
}
