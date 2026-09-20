/**
 * src/features/permissions/permission-registry.ts
 *
 * Single source of truth for app permissions.
 * Spec §3:
 *   - "Every permission is declared once, defaults to not requested / not granted,
 *      and is requested only at the point of use (never all at launch)"
 *   - CAMERA: { status: 'undetermined', rationale: '...' }
 *   - LOCATION: { status: 'undetermined', rationale: '...' }
 *   - CONTACTS: { status: 'undetermined', rationale: '...' }
 *   - STORAGE: { status: 'undetermined', rationale: '...' }
 *   - NOTIFICATIONS: { status: 'undetermined', rationale: '...' }
 */

import {
  PermissionsAndroid,
  Platform,
  Linking,
  type Permission,
} from 'react-native';
import { create } from 'zustand';

export type PermissionKey =
  | 'CAMERA'
  | 'LOCATION'
  | 'CONTACTS'
  | 'STORAGE'
  | 'NOTIFICATIONS';

export type PermissionStatus =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';

export type PermissionConfig = {
  key: PermissionKey;
  title: string;
  rationale: string;
  icon: string;
  androidPermission?: Permission | undefined;
};

export const PERMISSION_REGISTRY: Record<PermissionKey, PermissionConfig> = {
  CAMERA: {
    key: 'CAMERA',
    title: 'Camera Access',
    rationale:
      'Required to scan QR codes, take profile photos, and capture verification documents.',
    icon: '📷',
    androidPermission: PermissionsAndroid.PERMISSIONS.CAMERA,
  },
  LOCATION: {
    key: 'LOCATION',
    title: 'Location Services',
    rationale:
      'Used to provide localized experiences, geofencing, and delivery tracking.',
    icon: '📍',
    androidPermission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  },
  CONTACTS: {
    key: 'CONTACTS',
    title: 'Contacts Access',
    rationale:
      'Allows you to discover friends and invite colleagues to collaborate easily.',
    icon: '👥',
    androidPermission: PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  },
  STORAGE: {
    key: 'STORAGE',
    title: 'Photo & Media Storage',
    rationale:
      'Needed to save downloaded files, cached exports, and upload media assets.',
    icon: '💾',
    androidPermission:
      Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  },
  NOTIFICATIONS: {
    key: 'NOTIFICATIONS',
    title: 'Push Notifications',
    rationale:
      'Delivers real-time security alerts, order status updates, and critical reminders.',
    icon: '🔔',
    androidPermission:
      Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        : undefined,
  },
};

interface PermissionState {
  statuses: Record<PermissionKey, PermissionStatus>;
  setStatus: (key: PermissionKey, status: PermissionStatus) => void;
  resetAll: () => void;
}

const DEFAULT_STATUSES: Record<PermissionKey, PermissionStatus> = {
  CAMERA: 'undetermined',
  LOCATION: 'undetermined',
  CONTACTS: 'undetermined',
  STORAGE: 'undetermined',
  NOTIFICATIONS: 'undetermined',
};

export const usePermissionStore = create<PermissionState>((set) => ({
  statuses: { ...DEFAULT_STATUSES },
  setStatus: (key, status) =>
    set((state) => ({
      statuses: { ...state.statuses, [key]: status },
    })),
  resetAll: () => set({ statuses: { ...DEFAULT_STATUSES } }),
}));

/**
 * Open device system settings for this app.
 */
export async function openAppSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.warn('[permissions] Failed to open app settings:', error);
  }
}

/**
 * Check the native status of a permission.
 */
export async function checkPermission(
  key: PermissionKey,
): Promise<PermissionStatus> {
  const config = PERMISSION_REGISTRY[key];
  if (!config) {
    return 'unavailable';
  }

  if (Platform.OS === 'android') {
    if (!config.androidPermission) {
      return 'granted';
    }
    try {
      const hasPermission = await PermissionsAndroid.check(
        config.androidPermission,
      );
      const status: PermissionStatus = hasPermission
        ? 'granted'
        : 'undetermined';
      usePermissionStore.getState().setStatus(key, status);
      return status;
    } catch {
      return 'unavailable';
    }
  }

  // On iOS: return the state from the registry store
  const currentStatus =
    usePermissionStore.getState().statuses[key] ?? 'undetermined';
  return currentStatus;
}

/**
 * Request a permission using native prompt where available.
 */
export async function requestPermission(
  key: PermissionKey,
): Promise<PermissionStatus> {
  const config = PERMISSION_REGISTRY[key];
  if (!config) {
    return 'unavailable';
  }

  if (Platform.OS === 'android') {
    if (!config.androidPermission) {
      usePermissionStore.getState().setStatus(key, 'granted');
      return 'granted';
    }

    try {
      const result = await PermissionsAndroid.request(config.androidPermission, {
        title: config.title,
        message: config.rationale,
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      });

      let mappedStatus: PermissionStatus = 'denied';
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        mappedStatus = 'granted';
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        mappedStatus = 'blocked';
      } else {
        mappedStatus = 'denied';
      }

      usePermissionStore.getState().setStatus(key, mappedStatus);
      return mappedStatus;
    } catch (error) {
      console.warn(`[permissions] Error requesting ${key}:`, error);
      return 'unavailable';
    }
  }

  // On iOS:
  const current = usePermissionStore.getState().statuses[key];
  const newStatus: PermissionStatus =
    current === 'blocked' ? 'blocked' : 'granted';
  usePermissionStore.getState().setStatus(key, newStatus);
  return newStatus;
}
