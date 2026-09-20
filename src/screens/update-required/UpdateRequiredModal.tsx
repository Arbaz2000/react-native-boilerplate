/**
 * src/screens/update-required/UpdateRequiredModal.tsx
 *
 * Non-dismissible force-update modal.
 * Spec §1, §5:
 *   - Displayed when installed version < minSupportedVersion
 *   - Blocks access to the application
 *   - Deep links to the Google Play Store / Apple App Store listing
 *   - Provides preview exit for testing when navigated from debug settings
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { APP_VERSION } from '@/config/constants';
import { APP_IDENTITY } from '@/config/branding';
import { SafeScreen } from '@/components/layout/SafeScreen';
import type { RootStackScreenProps } from '@/navigation/types';

export function UpdateRequiredModal({
  navigation,
}: RootStackScreenProps<'UpdateRequired'>) {
  const { colors, spacing, radii, typography } = useAppTheme();

  const handleUpdate = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com',
      android: 'https://play.google.com/store',
      default: 'https://example.com',
    });

    Linking.openURL(storeUrl).catch((err) => {
      console.warn('Failed to open store URL:', err);
    });
  };

  const canGoBack = navigation.canGoBack();

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <View style={styles.content}>
        {/* Warning Icon Emblem */}
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: colors.warning + '20',
              borderColor: colors.warning,
            },
          ]}
        >
          <Text style={[styles.iconGlyph, { color: colors.warning }]}>▲</Text>
        </View>

        <Text
          style={[
            typography.headlineMedium,
            { color: colors.textPrimary, marginTop: spacing.xl, textAlign: 'center' },
          ]}
        >
          Update Required
        </Text>

        <Text
          style={[
            typography.bodyMedium,
            {
              color: colors.textSecondary,
              marginTop: spacing.sm,
              textAlign: 'center',
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          A critical release of {APP_IDENTITY.appName} is available. To protect your security and maintain data synchronization, please upgrade before continuing.
        </Text>

        {/* Version Information Card */}
        <View
          style={[
            styles.versionCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.md,
              padding: spacing.md,
              marginTop: spacing.xl,
            },
          ]}
        >
          <View style={styles.versionRow}>
            <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
              Installed Version:
            </Text>
            <Text style={[typography.bodySmall, { color: colors.error, fontWeight: '700' }]}>
              v{APP_VERSION} (Deprecated)
            </Text>
          </View>

          <View style={[styles.versionRow, { marginTop: spacing.xs }]}>
            <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
              Package ID:
            </Text>
            <Text style={[typography.bodySmall, { color: colors.textPrimary, fontWeight: '600' }]}>
              {APP_IDENTITY.bundleId}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleUpdate}
          style={[
            styles.primaryButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.md,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <Text style={[styles.primaryButtonText, { color: colors.white }]}>
            Update via {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}
          </Text>
        </TouchableOpacity>

        {canGoBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={[styles.dismissBtn, { marginTop: spacing.md }]}
          >
            <Text style={[typography.labelMedium, { color: colors.textSecondary }]}>
              Close Demo Preview
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
    </SafeScreen>
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
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontSize: 36,
    fontWeight: '800',
  },
  versionCard: {
    width: '100%',
    borderWidth: 1,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
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
  dismissBtn: {
    paddingVertical: 8,
  },
});
