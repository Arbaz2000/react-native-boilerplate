/**
 * src/screens/home/HomeScreen.tsx
 *
 * Tab 0: Home Screen (always present).
 * Showcases core features, interactive UI store triggers, and architecture metrics.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useAuthStore } from '@/features/auth/auth.slice';
import { useUIStore } from '@/store/zustand/useUIStore';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { APP_IDENTITY } from '@/config/branding';
import env from '@/config/env';
import type { BottomTabScreenPropsType } from '@/navigation/types';

export function HomeScreen({}: BottomTabScreenPropsType<'Home'>) {
  const { colors, spacing, radii, typography, dark, preference } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const showToast = useUIStore((state) => state.showToast);
  const showLoader = useUIStore((state) => state.showLoader);
  const hideLoader = useUIStore((state) => state.hideLoader);

  const handleTestToast = () => {
    showToast('✨ UI Store Toast: Feature executed cleanly!', 'success');
  };

  const handleTestLoader = () => {
    showLoader('Testing global UI loader...');
    setTimeout(() => {
      hideLoader();
      showToast('Global loader dismissed successfully.', 'info');
    }, 1500);
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
      >
      {/* Header Profile / Welcome */}
      <View style={styles.header}>
        <View style={styles.rowBetween}>
          <View>
            <Text
              style={[
                typography.labelSmall,
                { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1.2 },
              ]}
            >
              {APP_IDENTITY.shortName} Workspace
            </Text>
            <Text
              style={[
                typography.headlineMedium,
                { color: colors.textPrimary, marginTop: spacing.xxs },
              ]}
            >
              Hello, {user?.name || 'Developer'}
            </Text>
          </View>

          <View
            style={[
              styles.envPill,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.full,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xxs,
              },
            ]}
          >
            <Text style={[typography.labelSmall, { color: colors.primary }]}>
              {env.appEnv.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text
          style={[
            typography.bodyMedium,
            { color: colors.textSecondary, marginTop: spacing.xs },
          ]}
        >
          {APP_IDENTITY.tagline}
        </Text>
      </View>

      {/* Interactive UI Store Testing Card */}
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
          Interactive State Triggers
        </Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: spacing.xxs },
          ]}
        >
          Test Zustand global UI store triggers (transient toasts and full-screen loaders).
        </Text>

        <View style={[styles.buttonRow, { marginTop: spacing.md }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleTestToast}
            style={[
              styles.btn,
              {
                backgroundColor: colors.primary,
                borderRadius: radii.md,
                paddingVertical: spacing.sm,
                marginRight: spacing.sm,
              },
            ]}
          >
            <Text style={[styles.btnText, { color: colors.white }]}>
              Trigger Toast
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleTestLoader}
            style={[
              styles.btn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: radii.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Text style={[styles.btnText, { color: colors.textPrimary }]}>
              Trigger Loader
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Architecture Highlights Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.lg,
            marginTop: spacing.md,
          },
        ]}
      >
        <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
          Production Architecture
        </Text>
        <View style={{ marginTop: spacing.sm }}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Navigation:</Text> React Navigation v7 with nested stacks & composite screen props
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Theme Engine:</Text> 4pt grid tokens, active: {dark ? 'Dark' : 'Light'} ({preference})
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>State Management:</Text> Redux Toolkit + RTK Query + React Query + Zustand 5
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Rebranding:</Text> 1-step client white-labeling via branding.ts
          </Text>
        </View>
      </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  envPill: {
    borderWidth: 1,
  },
  card: {
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
