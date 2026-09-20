/**
 * src/features/permissions/usePermission.ts
 *
 * Hook to inspect, check, and request permissions.
 * Spec §3:
 *   `usePermission('LOCATION')` returns `{ status, request(), openSettings() }`.
 */

import { useState, useCallback } from 'react';
import {
  type PermissionKey,
  type PermissionStatus,
  PERMISSION_REGISTRY,
  usePermissionStore,
  checkPermission,
  requestPermission,
  openAppSettings,
} from './permission-registry';

export function usePermission(key: PermissionKey) {
  const status = usePermissionStore(
    (state) => state.statuses[key] ?? 'undetermined',
  );
  const setStatus = usePermissionStore((state) => state.setStatus);
  const [isLoading, setIsLoading] = useState(false);
  const config = PERMISSION_REGISTRY[key];

  const check = useCallback(async (): Promise<PermissionStatus> => {
    setIsLoading(true);
    try {
      const current = await checkPermission(key);
      return current;
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const request = useCallback(async (): Promise<PermissionStatus> => {
    setIsLoading(true);
    try {
      const result = await requestPermission(key);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const openSettings = useCallback(async () => {
    await openAppSettings();
  }, []);

  return {
    status,
    isGranted: status === 'granted',
    isBlocked: status === 'blocked',
    isDenied: status === 'denied',
    isUndetermined: status === 'undetermined',
    config,
    request,
    check,
    openSettings,
    setStatus: useCallback(
      (newStatus: PermissionStatus) => setStatus(key, newStatus),
      [key, setStatus],
    ),
    isLoading,
  };
}
