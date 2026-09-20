/**
 * src/screens/chat/ChatScreen.tsx
 *
 * Tab 3: Slot 4 (swap per client, e.g. "Chat" / "Bookings" / "Activity").
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import type { BottomTabScreenPropsType } from '@/navigation/types';

export function ChatScreen({}: BottomTabScreenPropsType<'Chat'>) {
  const { colors, spacing, radii, typography } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      <View style={styles.header}>
        <Text style={[typography.labelMedium, { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 }]}>
          Slot 4 (Swappable)
        </Text>
        <Text style={[typography.headlineMedium, { color: colors.textPrimary, marginTop: spacing.xs }]}>
          Chat
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Configured via tabs.config.ts — swap for Messaging, Bookings, or Notifications.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.lg }]}>
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Real-time Ready
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Hook up WebSockets, Firebase Cloud Messaging, or Stream Chat in this slot for live communications.
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
