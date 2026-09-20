/**
 * src/navigation/types.ts
 *
 * Typed param lists for every stack / navigator.
 * All screens that accept route params must be listed here.
 *
 * Rule: if a screen needs no params, mark it `undefined`.
 * Rule: never import screen components here — types only.
 */

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;        // nested stack
  Main: undefined;        // nested bottom tabs
  UpdateRequired: undefined;
};

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
  Explore: undefined;     // Slot 3 — rename per client
  Chat: undefined;        // Slot 4 — rename per client
  Settings: undefined;
};
