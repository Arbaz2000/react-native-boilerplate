/**
 * src/app/bootstrap/initApp.ts
 *
 * Runs before the first render.
 * Add: crash reporter init, remote config seed, analytics init, etc.
 *
 * Must be fast and non-blocking — heavy work should be deferred.
 */
export async function initApp(): Promise<void> {
  // 1. Initialize crash reporter (e.g. Crashlytics) here
  // await crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);

  // 2. Seed any critical caches here
  // await someCache.warmUp();

  // 3. Log app start for analytics
  // analytics().logEvent('app_start');

  // Intentionally lightweight — returns immediately in this boilerplate stub
}
