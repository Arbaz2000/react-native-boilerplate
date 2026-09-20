/**
 * src/screens/settings/SettingsScreen.tsx
 *
 * Tab 4: Settings Screen (always present).
 * Controls theme preference, onboarding reset, and auth logout.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useAuthStore } from '@/features/auth/auth.slice';
import { useOnboardingStore } from '@/store/zustand/useOnboardingStore';
import { resetRoot } from '@/navigation/navigationRef';
import { APP_VERSION } from '@/config/constants';
import type { BottomTabScreenPropsType } from '@/navigation/types';

export function SettingsScreen({}: BottomTabScreenPropsType<'Settings'>) {
  const { colors, spacing, radii, typography, dark, preference, togglePreference } = useAppTheme();
  const { user, logout } = useAuthStore();
  const { hasOnboarded, resetOnboarding } = useOnboardingStore();

  const handleLogout = () => {
    logout();
    resetRoot('Auth');
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <View style={styles.header}>
        <Text style={[typography.headlineMedium, { color: colors.textPrimary }]}>
          Settings
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Account & App Preferences
        </Text>
      </View>

      {/* User Info Card */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.lg }]}>
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Signed in as
        </Text>
        <Text style={[typography.bodyLarge, { color: colors.primary, marginTop: spacing.xs, fontWeight: '600' }]}>
          {user?.name || 'Developer'}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
          {user?.email || 'demo@example.com'}
        </Text>
      </View>

      {/* Theme Card */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.md }]}>
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Appearance
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Current: <Text style={{ color: colors.primary, fontWeight: '700' }}>{preference.toUpperCase()}</Text> ({dark ? 'Dark Mode' : 'Light Mode'})
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={togglePreference}
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: radii.md, paddingVertical: spacing.sm, marginTop: spacing.md }]}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            Cycle Theme (System → Light → Dark)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Development / Testing Tools */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.md }]}>
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Boilerplate Testing Tools
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Onboarding Flag: <Text style={{ fontWeight: '700', color: hasOnboarded ? colors.success : colors.warning }}>{hasOnboarded ? 'Completed' : 'Pending'}</Text>
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleResetOnboarding}
          style={[styles.secondaryButton, { borderColor: colors.border, borderRadius: radii.md, paddingVertical: spacing.sm, marginTop: spacing.md }]}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>
            Reset Onboarding Flag
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleLogout}
        style={[styles.dangerButton, { backgroundColor: colors.error, borderRadius: radii.md, paddingVertical: spacing.md, marginTop: spacing.xl }]}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Log Out</Text>
      </TouchableOpacity>

      <Text style={[typography.labelSmall, { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.lg }]}>
        App Version {APP_VERSION}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 16,
  },
  card: {
    borderWidth: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dangerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
