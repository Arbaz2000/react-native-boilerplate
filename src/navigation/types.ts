/**
 * src/navigation/types.ts
 *
 * Typed param lists and screen props for every stack / navigator.
 * All screens that accept route params must be listed here.
 *
 * Rule: if a screen needs no params, mark it `undefined`.
 * Rule: never import screen components here — types only.
 */

import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ── Param Lists ──────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Explore: undefined; // Slot 3 — swap per client
  Chat: undefined;    // Slot 4 — swap per client
  Settings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList> | undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Main: NavigatorScreenParams<BottomTabParamList> | undefined;
  UpdateRequired: undefined;
};

// ── Screen Props ─────────────────────────────

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OnboardingStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type BottomTabScreenPropsType<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

// ── Global Type Augmentation ─────────────────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
