/**
 * src/screens/dashboard/DashboardScreen.tsx
 *
 * Tab 1: Dashboard Screen (always present).
 * Client analytics, build metrics, and project health indicators.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useUIStore } from '@/store/zustand/useUIStore';
import type { BottomTabScreenPropsType } from '@/navigation/types';

export function DashboardScreen({}: BottomTabScreenPropsType<'Dashboard'>) {
  const { colors, spacing, radii, typography } = useAppTheme();
  const showToast = useUIStore((state) => state.showToast);
  const [filter, setFilter] = useState<'7d' | '30d' | 'all'>('7d');

  const stats = [
    { label: 'Active Modules', value: '14', change: '+2 this week' },
    { label: 'API Uptime', value: '99.9%', change: 'Stable' },
    { label: 'Screen Routes', value: '10', change: 'Fully Typed' },
    { label: 'Bundle Size', value: 'Minimal', change: 'Optimized' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
    >
      <View style={styles.header}>
        <Text
          style={[
            typography.labelSmall,
            { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1.2 },
          ]}
        >
          Performance & Telemetry
        </Text>
        <Text
          style={[
            typography.headlineMedium,
            { color: colors.textPrimary, marginTop: spacing.xxs },
          ]}
        >
          Project Dashboard
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterRow, { marginTop: spacing.md }]}>
        {(['7d', '30d', 'all'] as const).map((item) => {
          const isActive = filter === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: colors.border,
                  borderRadius: radii.sm,
                  paddingVertical: spacing.xs,
                  paddingHorizontal: spacing.md,
                  marginRight: spacing.sm,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelSmall,
                  { color: isActive ? colors.white : colors.textSecondary },
                ]}
              >
                {item === 'all' ? 'All Time' : `Last ${item}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Stats Grid */}
      <View style={[styles.grid, { marginTop: spacing.lg }]}>
        {stats.map((stat, i) => (
          <View
            key={i}
            style={[
              styles.gridItem,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.md,
                padding: spacing.md,
              },
            ]}
          >
            <Text style={[typography.labelSmall, { color: colors.textSecondary }]}>
              {stat.label}
            </Text>
            <Text
              style={[
                typography.headlineSmall,
                { color: colors.primary, marginTop: spacing.xs },
              ]}
            >
              {stat.value}
            </Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.success, marginTop: spacing.xxs, fontWeight: '500' },
              ]}
            >
              {stat.change}
            </Text>
          </View>
        ))}
      </View>

      {/* Client Build Status Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.lg,
            marginTop: spacing.lg,
          },
        ]}
      >
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Continuous Delivery
        </Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: spacing.xs },
          ]}
        >
          Android Release keystore & iOS Fastlane configuration ready. Zero build failures reported on native Gradle/Xcode workflows.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => showToast('Syncing latest deployment reports...', 'info')}
          style={[
            styles.syncBtn,
            {
              backgroundColor: colors.primary + '18',
              borderRadius: radii.md,
              paddingVertical: spacing.sm,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text style={[typography.labelMedium, { color: colors.primary }]}>
            Sync Deployment Telemetry
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterBtn: {
    borderWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    borderWidth: 1,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
  },
  syncBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
