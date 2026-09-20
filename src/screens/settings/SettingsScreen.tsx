/**
 * src/screens/settings/SettingsScreen.tsx
 *
 * Tab 4: Settings Screen (always present).
 * Controls appearance, debugging/testing actions, app identity information, and authentication logout.
 * References:
 *   - App-Identity-Rebranding-Strategy.md (§1)
 *   - RN-Freelance-Boilerplate-Setup.md (§4)
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
import { useAuthStore } from '@/features/auth/auth.slice';
import { useOnboardingStore } from '@/store/zustand/useOnboardingStore';
import { useUIStore } from '@/store/zustand/useUIStore';
import { resetRoot } from '@/navigation/navigationRef';
import { APP_IDENTITY } from '@/config/branding';
import { APP_VERSION } from '@/config/constants';
import env from '@/config/env';
import {
  PERMISSION_REGISTRY,
  usePermissionStore,
  requestPermission,
  openAppSettings,
  PermissionGate,
  type PermissionKey,
} from '@/features/permissions';
import { SafeScreen } from '@/components/layout/SafeScreen';
import type { BottomTabScreenPropsType } from '@/navigation/types';

export function SettingsScreen({ navigation }: BottomTabScreenPropsType<'Settings'>) {
  const {
    colors,
    spacing,
    radii,
    typography,
    dark,
    preference,
    setPreference,
  } = useAppTheme();
  const { user, logout } = useAuthStore();
  const { hasOnboarded, resetOnboarding } = useOnboardingStore();
  const showToast = useUIStore((state) => state.showToast);
  const [showGateDemo, setShowGateDemo] = useState(false);
  const permissionStatuses = usePermissionStore((state) => state.statuses);
  const resetPermissions = usePermissionStore((state) => state.resetAll);

  const handleLogout = () => {
    logout();
    resetRoot('Auth');
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    showToast('Onboarding flag reset! Restart or cold-boot to re-test.', 'info');
  };

  const handleTestForceUpdate = () => {
    navigation.navigate('UpdateRequired');
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
      >
      <View style={styles.header}>
        <Text style={[typography.headlineMedium, { color: colors.textPrimary }]}>
          Settings
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            { color: colors.textSecondary, marginTop: spacing.xxs },
          ]}
        >
          Manage application & portfolio preferences
        </Text>
      </View>

      {/* Account Profile Card */}
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
        <View style={styles.rowBetween}>
          <View>
            <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
              {user?.name || 'Developer'}
            </Text>
            <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
              {user?.email || 'demo@example.com'}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primary + '18',
                borderRadius: radii.full,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xxs,
              },
            ]}
          >
            <Text style={[typography.labelSmall, { color: colors.primary }]}>
              Authenticated
            </Text>
          </View>
        </View>
      </View>

      {/* Theme Selection Card */}
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
          Appearance
        </Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: spacing.xxs },
          ]}
        >
          Current: <Text style={{ fontWeight: '700', color: colors.primary }}>{preference.toUpperCase()}</Text> ({dark ? 'Dark Mode' : 'Light Mode'})
        </Text>

        <View style={[styles.themeOptionRow, { marginTop: spacing.md }]}>
          {(['system', 'light', 'dark'] as const).map((opt) => {
            const isActive = preference === opt;
            return (
              <TouchableOpacity
                key={opt}
                onPress={() => setPreference(opt)}
                style={[
                  styles.themeOptionBtn,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderRadius: radii.md,
                    paddingVertical: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: isActive ? colors.white : colors.textPrimary },
                  ]}
                >
                  {opt === 'system' ? 'System' : opt === 'light' ? 'Light' : 'Dark'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Developer / Portfolio Testing Tools */}
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
          Testing & Showcase Controls
        </Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: spacing.xxs },
          ]}
        >
          Onboarding status:{' '}
          <Text
            style={{
              fontWeight: '700',
              color: hasOnboarded ? colors.success : colors.warning,
            }}
          >
            {hasOnboarded ? 'Completed' : 'Pending'}
          </Text>
        </Text>

        <View style={{ marginTop: spacing.md }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleResetOnboarding}
            style={[
              styles.actionBtn,
              {
                borderColor: colors.border,
                borderRadius: radii.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
              Reset Onboarding Carousel Flag
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleTestForceUpdate}
            style={[
              styles.actionBtn,
              {
                borderColor: colors.border,
                borderRadius: radii.md,
                paddingVertical: spacing.sm,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
              Preview UpdateRequired Modal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Permissions Registry (Spec §3) */}
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
        <View style={styles.rowBetween}>
          <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
            Permission Registry (Default-Off)
          </Text>
          <TouchableOpacity
            onPress={() => {
              resetPermissions();
              showToast('All permissions reset to default-off (undetermined)', 'info');
            }}
          >
            <Text style={[typography.labelSmall, { color: colors.primary }]}>
              Reset All
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: spacing.xxs, marginBottom: spacing.md },
          ]}
        >
          Permissions are requested strictly at point of use. Never requested automatically on cold boot.
        </Text>

        {(Object.keys(PERMISSION_REGISTRY) as PermissionKey[]).map((key) => {
          const config = PERMISSION_REGISTRY[key];
          const status = permissionStatuses[key];
          const isGranted = status === 'granted';
          const isBlocked = status === 'blocked';

          let statusColor = colors.textSecondary;
          if (isGranted) statusColor = colors.success;
          if (isBlocked) statusColor = colors.warning;
          if (status === 'denied') statusColor = colors.error;

          return (
            <View
              key={key}
              style={[
                styles.permissionItem,
                { borderBottomColor: colors.border, paddingVertical: spacing.sm },
              ]}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, marginRight: spacing.sm }}>{config.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.labelLarge, { color: colors.textPrimary }]}>
                    {config.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[typography.bodySmall, { color: colors.textSecondary }]}
                  >
                    {config.rationale}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                  if (isBlocked) {
                    await openAppSettings();
                  } else if (isGranted) {
                    showToast(`${config.title} already granted`, 'success');
                  } else {
                    const result = await requestPermission(key);
                    showToast(`${config.title}: ${result}`, result === 'granted' ? 'success' : 'info');
                  }
                }}
                style={[
                  styles.badge,
                  {
                    backgroundColor: statusColor + '18',
                    borderRadius: radii.full,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xxs,
                    marginLeft: spacing.sm,
                  },
                ]}
              >
                <Text style={[typography.labelSmall, { color: statusColor, fontWeight: '700' }]}>
                  {status.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Inline PermissionGate demo toggle */}
        <View style={{ marginTop: spacing.md }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowGateDemo((prev) => !prev)}
            style={[
              styles.actionBtn,
              {
                borderColor: colors.border,
                borderRadius: radii.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>
              {showGateDemo ? 'Hide <PermissionGate> Demo' : 'Test <PermissionGate> for Camera'}
            </Text>
          </TouchableOpacity>

          {showGateDemo && (
            <View style={{ marginTop: spacing.md }}>
              <PermissionGate permission="CAMERA">
                <View
                  style={{
                    backgroundColor: colors.success + '18',
                    borderColor: colors.success,
                    borderWidth: 1,
                    borderRadius: radii.md,
                    padding: spacing.md,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24 }}>📷 ✅</Text>
                  <Text
                    style={[
                      typography.titleMedium,
                      { color: colors.success, marginTop: spacing.xs, fontWeight: '700' },
                    ]}
                  >
                    Camera Access Granted!
                  </Text>
                  <Text
                    style={[
                      typography.bodySmall,
                      { color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
                    ]}
                  >
                    Protected scanner UI is unlocked and rendering its child components.
                  </Text>
                </View>
              </PermissionGate>
            </View>
          )}
        </View>
      </View>

      {/* App Identity & Build Telemetry */}
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
          App Identity & Environment
        </Text>
        <View style={{ marginTop: spacing.sm }}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            • App Name: <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{APP_IDENTITY.appName}</Text>
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
            • Template Identity: <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{APP_IDENTITY.shortName} by {APP_IDENTITY.author}</Text>
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
            • Bundle ID: <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{APP_IDENTITY.bundleId}</Text>
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
            • Target Version: <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{APP_VERSION}</Text>
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
            • Runtime Env: <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{env.appEnv}</Text>
          </Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleLogout}
        style={[
          styles.logoutBtn,
          {
            backgroundColor: colors.error,
            borderRadius: radii.md,
            paddingVertical: spacing.md,
            marginTop: spacing.xl,
          },
        ]}
      >
        <Text style={[styles.logoutText, { color: colors.white }]}>
          Sign Out of Workspace
        </Text>
      </TouchableOpacity>
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
  badge: {
    alignSelf: 'center',
  },
  card: {
    borderWidth: 1,
  },
  themeOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOptionBtn: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionBtn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  logoutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
