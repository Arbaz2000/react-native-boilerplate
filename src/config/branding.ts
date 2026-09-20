/**
 * src/config/branding.ts
 *
 * App Identity & Rebranding Configuration.
 * Reference: App-Identity-Rebranding-Strategy.md
 *
 * ─────────────────────────────────────────────────────────────
 * EDIT THIS FILE TO REBRAND FOR A NEW CLIENT:
 *   1. Update `appName`, `shortName`, `tagline`, and `author`.
 *   2. Update `onboardingSlides` with the client's feature highlights.
 *   3. All screens (Splash, Welcome Carousel, Auth, Settings)
 *      consume this file — zero UI code edits required!
 * ─────────────────────────────────────────────────────────────
 */

export type OnboardingSlide = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: string;
};

export const APP_IDENTITY = {
  /** Full product / client name */
  appName: 'RN Freelance Boilerplate',
  /** Short abbreviation or monogram for badges */
  shortName: 'AntigravityRN',
  /** Tagline shown on Splash and Auth headers */
  tagline: 'High-performance React Native starter for client projects',
  /** Creator / Portfolio author credits */
  author: 'Arbaz',
  /** Bundle ID for display / debug info */
  bundleId: 'com.arbaz.rnboilerplate',
  /** Support contact email */
  supportEmail: 'support@example.com',
  /** Privacy policy and terms URLs */
  privacyPolicyUrl: 'https://example.com/privacy',
  termsUrl: 'https://example.com/terms',
} as const;

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'slide-1',
    badge: 'Production Ready',
    title: 'Client-Grade Architecture',
    subtitle:
      'Engineered with React Native CLI, strict TypeScript, React Navigation v7, and layered state management.',
    icon: '⚡',
  },
  {
    id: 'slide-2',
    badge: 'Design System',
    title: 'Adaptive Theming',
    subtitle:
      'Comprehensive 4pt spacing scale, semantic color tokens, and seamless system/light/dark mode switching.',
    icon: '🎨',
  },
  {
    id: 'slide-3',
    badge: 'Rapid Delivery',
    title: '1-Step Client Rebranding',
    subtitle:
      'Config-driven bottom tabs, centralized app identity, and isolated feature modules for instant delivery.',
    icon: '🚀',
  },
];
