/**
 * src/screens/auth/LoginScreen.tsx
 *
 * Login screen.
 * Handles sign in and redirects to Main on success.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useAuthStore } from '@/features/auth/auth.slice';
import { resetRoot } from '@/navigation/navigationRef';
import type { AuthStackScreenProps } from '@/navigation/types';

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { colors, spacing, radii, typography } = useAppTheme();
  const setSession = useAuthStore((state) => state.setSession);

  const handleLogin = () => {
    setSession(
      { accessToken: 'mock_jwt_access_token', refreshToken: 'mock_jwt_refresh_token' },
      { id: 'usr_1', email: 'demo@example.com', name: 'Demo Client' },
    );
    resetRoot('Main');
  };

  const handleGoToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <View style={styles.header}>
        <Text style={[typography.headlineMedium, { color: colors.textPrimary }]}>
          Welcome Back
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Sign in to access your client dashboard.
        </Text>
      </View>

      <View style={styles.formPlaceholder}>
        <View style={[styles.inputMock, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md }]}>
          <Text style={{ color: colors.textTertiary }}>demo@example.com</Text>
        </View>
        <View style={[styles.inputMock, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, marginTop: spacing.md }]}>
          <Text style={{ color: colors.textTertiary }}>••••••••••••</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogin}
          style={[styles.primaryButton, { backgroundColor: colors.primary, borderRadius: radii.md, paddingVertical: spacing.md }]}
        >
          <Text style={[styles.primaryButtonText, { color: colors.white }]}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleGoToSignup}
          style={[styles.secondaryButton, { marginTop: spacing.md, paddingVertical: spacing.sm }]}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
            Don't have an account? Sign Up
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
