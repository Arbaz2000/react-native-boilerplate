/**
 * src/screens/onboarding/WelcomeScreen.tsx
 *
 * Welcome / Onboarding screen.
 * Shown only on first launch before the user has onboarded.
 *
 * Tapping "Get Started" sets hasOnboarded = true and advances to Auth.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useOnboardingStore } from '@/store/zustand/useOnboardingStore';
import { resetRoot } from '@/navigation/navigationRef';
import type { OnboardingStackScreenProps } from '@/navigation/types';

export function WelcomeScreen({}: OnboardingStackScreenProps<'Welcome'>) {
  const { colors, spacing, radii, typography } = useAppTheme();
  const setHasOnboarded = useOnboardingStore((state) => state.setHasOnboarded);

  const handleGetStarted = () => {
    setHasOnboarded(true);
    resetRoot('Auth');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: colors.primary + '18' }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>Welcome</Text>
        </View>

        <Text style={[typography.headlineMedium, { color: colors.textPrimary, marginTop: spacing.lg, textAlign: 'center' }]}>
          Build Fast.{'\n'}Ship Beautiful.
        </Text>

        <Text style={[typography.bodyLarge, { color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center' }]}>
          Production-grade React Native boilerplate designed for freelance client work and high-polish mobile apps.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleGetStarted}
          style={[styles.primaryButton, { backgroundColor: colors.primary, borderRadius: radii.md, paddingVertical: spacing.md }]}
        >
          <Text style={[styles.primaryButtonText, { color: colors.white }]}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actions: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
