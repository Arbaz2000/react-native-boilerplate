/**
 * src/screens/home/HomeScreen.tsx
 *
 * Tab 0: Home Screen (always present).
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useAuthStore } from '@/features/auth/auth.slice';
import type { BottomTabScreenPropsType } from '@/navigation/types';

export function HomeScreen({}: BottomTabScreenPropsType<'Home'>) {
  const { colors, spacing, radii, typography, dark, preference } = useAppTheme();
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <View style={styles.header}>
        <Text style={[typography.labelMedium, { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 }]}>
          Workspace
        </Text>
        <Text style={[typography.headlineMedium, { color: colors.textPrimary, marginTop: spacing.xs }]}>
          Welcome, {user?.name || 'Developer'}
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          RN Freelance Boilerplate v1.0.0
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.lg }]}>
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Active Theme
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Mode: <Text style={{ color: colors.primary, fontWeight: '700' }}>{dark ? 'Dark' : 'Light'}</Text> ({preference})
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.md }]}>
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Architecture Highlights
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          • React Navigation v7 with strict typing{'\n'}
          • 5 Config-driven bottom tabs via tabs.config.ts{'\n'}
          • Zustand 5 state management with AsyncStorage{'\n'}
          • First-launch and auth token gating in AppNavigator
        </Text>
      </View>
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
});
