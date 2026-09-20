/**
 * src/screens/dashboard/DashboardScreen.tsx
 *
 * Tab 1: Dashboard Screen (always present).
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import type { BottomTabScreenPropsType } from '@/navigation/types';

export function DashboardScreen({}: BottomTabScreenPropsType<'Dashboard'>) {
  const { colors, spacing, radii, typography } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <View style={styles.header}>
        <Text style={[typography.labelMedium, { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 }]}>
          Analytics
        </Text>
        <Text style={[typography.headlineMedium, { color: colors.textPrimary, marginTop: spacing.xs }]}>
          Dashboard
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md }]}>
          <Text style={[typography.labelSmall, { color: colors.textSecondary }]}>Active Projects</Text>
          <Text style={[typography.titleLarge, { color: colors.primary, marginTop: spacing.xs }]}>12</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, marginLeft: spacing.md }]}>
          <Text style={[typography.labelSmall, { color: colors.textSecondary }]}>Client Builds</Text>
          <Text style={[typography.titleLarge, { color: colors.accent, marginTop: spacing.xs }]}>48</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.lg }]}>
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Build Pipeline
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          All systems operational. Fastlane & GitHub Actions ready for CI/CD setup.
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
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
  },
  card: {
    borderWidth: 1,
  },
});
