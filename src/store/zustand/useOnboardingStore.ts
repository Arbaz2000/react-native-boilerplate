/**
 * src/store/zustand/useOnboardingStore.ts
 *
 * Persisted Zustand store tracking whether the user has completed
 * the onboarding carousel flow.
 *
 * Drives the first-launch gating in AppNavigator.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/config/constants';

type OnboardingState = {
  /** True once user completes or skips the onboarding flow */
  hasOnboarded: boolean;
  /** Mark onboarding as completed */
  setHasOnboarded: (completed: boolean) => void;
  /** Reset onboarding flag (useful for testing or profile reset) */
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasOnboarded: false,

      setHasOnboarded: (completed) => {
        set({ hasOnboarded: completed });
      },

      resetOnboarding: () => {
        set({ hasOnboarded: false });
      },
    }),
    {
      name: STORAGE_KEYS.HAS_ONBOARDED,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
