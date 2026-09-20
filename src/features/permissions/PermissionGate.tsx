/**
 * src/features/permissions/PermissionGate.tsx
 *
 * Component gate that wraps protected UI.
 * Spec §3:
 *   `<PermissionGate permission="CAMERA">` wraps any screen/component that needs it,
 *   showing a rationale UI before the native prompt fires.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { usePermission } from './usePermission';
import {
  type PermissionKey,
  type PermissionStatus,
} from './permission-registry';

export interface PermissionGateRenderProps {
  request: () => Promise<PermissionStatus>;
  openSettings: () => Promise<void>;
  status: PermissionStatus;
  isLoading: boolean;
}

export interface PermissionGateProps {
  permission: PermissionKey;
  children: React.ReactNode;
  /**
   * Optional custom fallback or render function when permission is not granted.
   */
  fallback?:
    | React.ReactNode
    | ((props: PermissionGateRenderProps) => React.ReactNode)
    | undefined;
  /**
   * Optional override for the rationale UI title.
   */
  title?: string | undefined;
  /**
   * Optional override for the rationale text.
   */
  rationale?: string | undefined;
}

export function PermissionGate({
  permission,
  children,
  fallback,
  title,
  rationale,
}: PermissionGateProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useAppTheme();
  const {
    status,
    isGranted,
    isBlocked,
    config,
    request,
    openSettings,
    isLoading,
  } = usePermission(permission);

  if (isGranted) {
    return <>{children}</>;
  }

  if (fallback) {
    if (typeof fallback === 'function') {
      return (
        <>
          {fallback({
            request,
            openSettings,
            status,
            isLoading,
          })}
        </>
      );
    }
    return <>{fallback}</>;
  }

  const displayTitle = title ?? config?.title ?? `${permission} Required`;
  const displayRationale =
    rationale ??
    config?.rationale ??
    'This feature requires device permission to proceed.';
  const displayIcon = config?.icon ?? '🔒';

  return (
    <View
      testID={`permission-gate-${permission.toLowerCase()}`}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.xl,
          padding: spacing.xl,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.bgSecondary,
            borderRadius: radii.full,
          },
        ]}
      >
        <Text style={styles.iconText}>{displayIcon}</Text>
      </View>

      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontSize: typography.titleLarge.fontSize,
            fontWeight: typography.titleLarge.fontWeight,
            marginTop: spacing.md,
          },
        ]}
      >
        {displayTitle}
      </Text>

      <Text
        style={[
          styles.rationale,
          {
            color: colors.textSecondary,
            fontSize: typography.bodyMedium.fontSize,
            lineHeight: typography.bodyMedium.lineHeight,
            marginTop: spacing.sm,
            marginBottom: spacing.lg,
          },
        ]}
      >
        {displayRationale}
      </Text>

      {isBlocked ? (
        <View style={styles.actionBlock}>
          <Text
            style={[
              styles.blockedNotice,
              {
                color: colors.warning,
                fontSize: typography.bodySmall.fontSize,
                marginBottom: spacing.md,
              },
            ]}
          >
            Permission was previously denied. Please enable it in device settings to continue.
          </Text>
          <TouchableOpacity
            testID={`permission-gate-open-settings-${permission.toLowerCase()}`}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                borderRadius: radii.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.xl,
              },
            ]}
            onPress={openSettings}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open device settings"
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: colors.white,
                  fontSize: typography.labelLarge.fontSize,
                  fontWeight: typography.labelLarge.fontWeight,
                },
              ]}
            >
              Open Device Settings
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          testID={`permission-gate-request-${permission.toLowerCase()}`}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.xl,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={request}
          disabled={isLoading}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Allow ${displayTitle}`}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text
              style={[
                styles.buttonText,
                {
                  color: colors.white,
                  fontSize: typography.labelLarge.fontSize,
                  fontWeight: typography.labelLarge.fontWeight,
                },
              ]}
            >
              Allow Access
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    textAlign: 'center',
  },
  rationale: {
    textAlign: 'center',
  },
  actionBlock: {
    width: '100%',
    alignItems: 'center',
  },
  blockedNotice: {
    textAlign: 'center',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    letterSpacing: 0.5,
  },
});
