/**
 * src/screens/auth/SignupScreen.tsx
 *
 * Registration screen.
 * Handles new user sign up and redirects to Main on success.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useAuthStore } from '@/features/auth/auth.slice';
import { resetRoot } from '@/navigation/navigationRef';
import type { AuthStackScreenProps } from '@/navigation/types';

export function SignupScreen({ navigation }: AuthStackScreenProps<'Signup'>) {
  const { colors, spacing, radii, typography } = useAppTheme();
  const setSession = useAuthStore((state) => state.setSession);

  const handleSignup = () => {
    setSession(
      { accessToken: 'mock_jwt_access_token', refreshToken: 'mock_jwt_refresh_token' },
      { id: 'usr_new', email: 'client@example.com', name: 'New Client' },
    );
    resetRoot('Main');
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <View style={styles.header}>
        <Text style={[typography.headlineMedium, { color: colors.textPrimary }]}>
          Create Account
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Join now to configure your client workspace.
        </Text>
      </View>

      <View style={styles.formPlaceholder}>
        <View style={[styles.inputMock, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md }]}>
          <Text style={{ color: colors.textTertiary }}>Client Name</Text>
        </View>
        <View style={[styles.inputMock, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, marginTop: spacing.md }]}>
          <Text style={{ color: colors.textTertiary }}>client@example.com</Text>
        </View>
        <View style={[styles.inputMock, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, marginTop: spacing.md }]}>
          <Text style={{ color: colors.textTertiary }}>••••••••••••</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSignup}
          style={[styles.primaryButton, { backgroundColor: colors.primary, borderRadius: radii.md, paddingVertical: spacing.md }]}
        >
          <Text style={[styles.primaryButtonText, { color: colors.white }]}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleGoToLogin}
          style={[styles.secondaryButton, { marginTop: spacing.md, paddingVertical: spacing.sm }]}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
            Already have an account? Log In
          </Text>
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
  header: {
    marginTop: 40,
  },
  formPlaceholder: {
    width: '100%',
  },
  inputMock: {
    borderWidth: 1,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
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
  secondaryButton: {
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
