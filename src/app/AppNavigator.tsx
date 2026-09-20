/**
 * src/app/AppNavigator.tsx
 *
 * Core navigation entry point & gating host.
 * Spec §1, §2:
 *   - Wraps NavigationContainer with global navigationRef and linkingConfig
 *   - Binds app design tokens from useAppTheme() to React Navigation theme
 *   - Hosts RootNavigator with cold-start gating (Splash -> Version Check -> Onboarding / Auth -> Main)
 */

import React, { useMemo } from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { useAppTheme } from '@/theme/useAppTheme';
import { navigationRef } from '@/navigation/navigationRef';
import { linkingConfig } from '@/features/deep-linking/linkingConfig';
import { RootNavigator } from '@/navigation/RootNavigator';

export function AppNavigator() {
  const { colors, dark } = useAppTheme();

  // Adapt app design tokens to React Navigation v7 Theme interface
  const navigationTheme: NavTheme = useMemo(() => {
    const baseTheme = dark ? NavDarkTheme : NavDefaultTheme;

    return {
      ...baseTheme,
      dark,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [colors, dark]);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linkingConfig}
      theme={navigationTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
