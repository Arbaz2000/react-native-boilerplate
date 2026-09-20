/**
 * src/theme/useAppTheme.ts
 *
 * The ONE hook every component uses to access theme tokens.
 *
 * Usage:
 * ```ts
 * const { colors, spacing, radii, typography, dark } = useAppTheme();
 * ```
 *
 * Returns the resolved AppTheme (light or dark) from ThemeContext.
 * Also re-exports the store's `setPreference` for theme toggling without
 * needing a separate Zustand import in UI code.
 */
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import type { AppTheme } from './tokens';
import { useThemeStore, type ThemePreference } from '@/store/zustand/useThemeStore';

/**
 * Access the fully-resolved theme tokens.
 *
 * @example
 * ```tsx
 * function MyCard() {
 *   const { colors, spacing, radii } = useAppTheme();
 *   return (
 *     <View style={{
 *       backgroundColor: colors.bgCard,
 *       padding: spacing.lg,
 *       borderRadius: radii.md,
 *     }}>
 *       <Text style={{ color: colors.textPrimary }}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useAppTheme(): AppTheme & {
  /** Current raw preference ('light' | 'dark' | 'system') */
  preference: ThemePreference;
  /** Change the theme preference — persisted across app restarts */
  setPreference: (pref: ThemePreference) => void;
} {
  const theme = useContext(ThemeContext);
  const preference = useThemeStore(s => s.preference);
  const setPreference = useThemeStore(s => s.setPreference);

  return {
    ...theme,
    preference,
    setPreference,
  };
}
