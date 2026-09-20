/**
 * src/app/bootstrap/versionCheck.ts
 *
 * Fetches remote config via RTK Query and determines if the installed version is:
 *   - FORCE_UPDATE_REQUIRED (installed < minSupportedVersion)
 *   - SOFT_UPDATE_AVAILABLE (installed < latestVersion, but >= minSupported)
 *   - UP_TO_DATE
 *
 * Consumed by SplashScreen and AppNavigator to gate the force-update screen.
 */

import { store } from '@/store';
import { remoteConfigApi } from '@/features/app-config/remote-config.api';
import { APP_VERSION } from '@/config/constants';
import { isLessThan } from '@/services/version/versionComparator';

export type VersionStatus =
  | 'UP_TO_DATE'
  | 'SOFT_UPDATE_AVAILABLE'
  | 'FORCE_UPDATE_REQUIRED';

export async function checkAppVersion(): Promise<VersionStatus> {
  try {
    const result = await store
      .dispatch(remoteConfigApi.endpoints.getRemoteConfig.initiate())
      .unwrap();

    if (result.minSupportedVersion && isLessThan(APP_VERSION, result.minSupportedVersion)) {
      return 'FORCE_UPDATE_REQUIRED';
    }

    if (result.latestVersion && isLessThan(APP_VERSION, result.latestVersion)) {
      return 'SOFT_UPDATE_AVAILABLE';
    }

    return 'UP_TO_DATE';
  } catch {
    // If network fails on cold boot, default to allowing user in rather than hard blocking
    return 'UP_TO_DATE';
  }
}
