/**
 * src/store/zustand/useThemeStore.ts
 *
 * Persisted Zustand store for the user's theme preference.
 *
 * Values: 'light' | 'dark' | 'system'
 *   - 'system' follows the OS appearance setting via useColorScheme().
 *   - ThemeProvider resolves this to an actual light/dark AppTheme.
 *
 * Persisted to AsyncStorage so the preference survives app restarts.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/config/constants';

// ── Types ────────────────────────────────────

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeState = {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  /** Cycle: system → light → dark → system */
  togglePreference: () => void;
};

// ── Store ────────────────────────────────────

const CYCLE: ThemePreference[] = ['system', 'light', 'dark'];

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: 'system',

      setPreference: (pref) => {
        set({ preference: pref });
      },

      togglePreference: () => {
        const current = get().preference;
        const idx = CYCLE.indexOf(current);
        const next = CYCLE[(idx + 1) % CYCLE.length] ?? 'system';
        set({ preference: next });
      },
    }),
    {
      name: STORAGE_KEYS.THEME_PREFERENCE,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
