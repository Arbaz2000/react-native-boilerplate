/**
 * src/services/version/versionComparator.ts
 *
 * Semver comparison utilities.
 * Compares dot-separated version strings (major.minor.patch).
 *
 * No external semver library — keeps the bundle lean.
 * Only handles production version strings (e.g. "1.2.3"), not pre-release tags.
 */

type VersionParts = [number, number, number];

function parse(version: string): VersionParts {
  const parts = version.split('.').map(Number);
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}

/**
 * Returns:
 *  -1  if a < b
 *   0  if a === b
 *   1  if a > b
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const [aMaj, aMin, aPat] = parse(a);
  const [bMaj, bMin, bPat] = parse(b);

  if (aMaj !== bMaj) return aMaj < bMaj ? -1 : 1;
  if (aMin !== bMin) return aMin < bMin ? -1 : 1;
  if (aPat !== bPat) return aPat < bPat ? -1 : 1;
  return 0;
}

export const isLessThan = (a: string, b: string) => compareVersions(a, b) === -1;
export const isGreaterThan = (a: string, b: string) => compareVersions(a, b) === 1;
export const isAtLeast = (a: string, b: string) => compareVersions(a, b) >= 0;
