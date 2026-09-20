/**
 * src/screens/explore/ExploreScreen.tsx
 *
 * Tab 2: Slot 3 (swap per client, e.g. "Explore" / "Orders" / "Catalog").
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import type { BottomTabScreenPropsType } from '@/navigation/types';

export function ExploreScreen({}: BottomTabScreenPropsType<'Explore'>) {
  const { colors, spacing, radii, typography } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <View style={styles.header}>
        <Text style={[typography.labelMedium, { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 }]}>
          Slot 3 (Swappable)
        </Text>
        <Text style={[typography.headlineMedium, { color: colors.textPrimary, marginTop: spacing.xs }]}>
          Explore
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Configured via tabs.config.ts — easily renamed or swapped for client-specific features.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.lg }]}>
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Customizable Tab Slot
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          This slot can be repurposed as "Orders", "Catalog", "Search", or any client domain view by changing 1 line in tabs.config.ts.
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
