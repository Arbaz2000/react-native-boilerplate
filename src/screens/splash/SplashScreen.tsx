/**
 * src/screens/splash/SplashScreen.tsx
 *
 * Cold-start screen.
 * Evaluates:
 *   1. Remote config / version status (force-update required?)
 *   2. First launch flag (hasOnboarded?)
 *   3. Authentication token presence (isAuthenticated?)
 *
 * Routes to the correct stack via resetRoot / navigation.reset.
 */

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useOnboardingStore } from '@/store/zustand/useOnboardingStore';
import { useAuthStore } from '@/features/auth/auth.slice';
import { checkAppVersion } from '@/app/bootstrap/versionCheck';
import { SPLASH_MIN_DISPLAY_MS } from '@/config/constants';
import type { RootStackScreenProps } from '@/navigation/types';

export function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const { colors, spacing, typography } = useAppTheme();
  const hasOnboarded = useOnboardingStore((state) => state.hasOnboarded);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    let isMounted = true;

    async function evaluateAppBootstrap() {
      const startTime = Date.now();

      // Check remote config for minimum supported version
      const versionStatus = await checkAppVersion();

      // Ensure splash is visible for at least SPLASH_MIN_DISPLAY_MS for brand polish
      const elapsed = Date.now() - startTime;
      const remainingWait = Math.max(0, SPLASH_MIN_DISPLAY_MS - elapsed);
      if (remainingWait > 0) {
        await new Promise((resolve) => setTimeout(() => resolve(undefined), remainingWait));
      }

      if (!isMounted) return;

      if (versionStatus === 'FORCE_UPDATE_REQUIRED') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UpdateRequired' }],
        });
      } else if (!hasOnboarded) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      } else if (!isAuthenticated) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    }

    evaluateAppBootstrap();

    return () => {
      isMounted = false;
    };
  }, [hasOnboarded, isAuthenticated, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.logoBadgeText, { color: colors.white }]}>RN</Text>
        </View>
        <Text style={[typography.titleLarge, { color: colors.textPrimary, marginTop: spacing.md }]}>
          RN Boilerplate
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Freelance Client Starter
        </Text>
      </View>
      <View style={[styles.footer, { paddingBottom: spacing.xxl }]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
  },
});
