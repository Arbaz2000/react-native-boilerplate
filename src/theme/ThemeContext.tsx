/**
 * src/theme/ThemeContext.tsx
 *
 * React Context that holds the **resolved** theme (light or dark).
 *
 * `ThemeProvider` sits near the top of the component tree (inside AppProviders).
 * It reads the user's preference from `useThemeStore` (Zustand, persisted) and
 * resolves `'system'` using `useColorScheme()`.
 *
 * Consumers should NOT import this context directly — use `useAppTheme()` instead.
 */
import React, { createContext, useMemo } from 'react';
import { useColorScheme, StatusBar } from 'react-native';

import {
  type AppTheme,
  lightTheme,
  darkTheme,
} from './tokens';
import { useThemeStore } from '@/store/zustand/useThemeStore';

// ── Context ──────────────────────────────────

export const ThemeContext = createContext<AppTheme>(lightTheme);

// ── Provider ─────────────────────────────────

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const preference = useThemeStore(s => s.preference);
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null

  const resolvedTheme = useMemo<AppTheme>(() => {
    if (preference === 'light') return lightTheme;
    if (preference === 'dark') return darkTheme;

    // preference === 'system' — follow OS
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }, [preference, systemScheme]);

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <StatusBar barStyle={resolvedTheme.colors.statusBar} />
      {children}
    </ThemeContext.Provider>
  );
}
