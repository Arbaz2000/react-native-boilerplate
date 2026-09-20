/**
 * src/screens/update-required/UpdateRequiredModal.tsx
 *
 * Non-dismissible force-update screen.
 * Shown when installed app version < minSupportedVersion from remote config.
 * Deep-links directly to Google Play Store / Apple App Store listing.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { APP_VERSION } from '@/config/constants';
import type { RootStackScreenProps } from '@/navigation/types';

export function UpdateRequiredModal({}: RootStackScreenProps<'UpdateRequired'>) {
  const { colors, spacing, radii, typography } = useAppTheme();

  const handleUpdate = () => {
    // Replace with real client app store URLs
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com',
      android: 'https://play.google.com/store',
      default: 'https://example.com',
    });

    Linking.openURL(storeUrl).catch((err) => {
      console.warn('Failed to open store URL:', err);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.warning + '20' }]}>
          <Text style={[styles.iconText, { color: colors.warning }]}>▲</Text>
        </View>

        <Text style={[typography.headlineMedium, { color: colors.textPrimary, marginTop: spacing.lg, textAlign: 'center' }]}>
          Update Required
        </Text>

        <Text style={[typography.bodyLarge, { color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center' }]}>
          A critical update is required to continue using this application. Please update to the latest version to maintain service availability.
        </Text>

        <View style={[styles.versionBox, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, marginTop: spacing.xl }]}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            Current Version: <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{APP_VERSION}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleUpdate}
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: radii.md, paddingVertical: spacing.md }]}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>Update Now</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
    fontWeight: '700',
  },
  versionBox: {
    borderWidth: 1,
  },
  actions: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
