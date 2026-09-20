/**
 * src/features/auth/auth.slice.ts
 *
 * Zustand store: session, tokens, user.
 * Spec §2 line 96: auth.slice.ts is the primary client-side session store.
 *
 * Drives authentication gating in AppNavigator.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser, AuthTokens } from './auth.types';

const AUTH_STORAGE_KEY = '@rnboilerplate/auth_session';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setSession: (tokens: AuthTokens, user: AuthUser) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setSession: (tokens, user) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
          isAuthenticated: true,
        });
      },

      setAccessToken: (accessToken) => {
        set({
          accessToken,
          isAuthenticated: Boolean(accessToken),
        });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      // In production Phase F, tokens will be mirrored/stored via secureStorage (Keychain/Keystore)
    },
  ),
);
