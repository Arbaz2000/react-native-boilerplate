/**
 * src/app/bootstrap/versionCheck.ts
 *
 * Fetches remote config and determines if the installed version is:
 *   - force-update required (installed < minSupportedVersion)
 *   - soft-update available (installed < latestVersion, but >= minSupported)
 *   - up to date
 *
 * Consumed by AppNavigator to gate the force-update screen.
 * Uses MSW in dev/test, real API in staging/production.
 */

export type VersionStatus =
  | 'UP_TO_DATE'
  | 'SOFT_UPDATE_AVAILABLE'
  | 'FORCE_UPDATE_REQUIRED';

// Stub — real implementation wires into RTK Query in Phase D/F
export async function checkAppVersion(): Promise<VersionStatus> {
  // TODO (Phase F): Replace with real RTK Query call to remote-config endpoint.
  // For now, always returns UP_TO_DATE so the app renders normally.
  return 'UP_TO_DATE';
}
