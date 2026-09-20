/**
 * src/screens/auth/LoginScreen.tsx
 *
 * Full Authentication Login screen.
 * References:
 *   - RN-Freelance-Boilerplate-Setup.md (§1)
 *   - App-Identity-Rebranding-Strategy.md (§1)
 *
 * Features:
 *   - Interactive email & password inputs with validation
 *   - Quick-fill demo credentials button for rapid portfolio review
 *   - 1-tap "Continue as Guest" bypass
 *   - Error alerts & loading state
 *   - Bridges directly to useAuthStore and resets navigation to Main
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useAuthStore } from '@/features/auth/auth.slice';
import { resetRoot } from '@/navigation/navigationRef';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { APP_IDENTITY } from '@/config/branding';
import type { AuthStackScreenProps } from '@/navigation/types';

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { colors, spacing, radii, typography } = useAppTheme();
  const setSession = useAuthStore((state) => state.setSession);

  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setErrorMessage(null);
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    // Simulate auth network latency for UI feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSession(
        {
          accessToken: 'jwt_mock_access_token_' + Date.now(),
          refreshToken: 'jwt_mock_refresh_token_' + Date.now(),
        },
        {
          id: 'usr_client_01',
          email: email.trim(),
          name: email.split('@')[0] || 'Client Demo',
        },
      );
      resetRoot('Main');
    }, 600);
  };

  const handleQuickGuest = () => {
    setSession(
      {
        accessToken: 'jwt_guest_token_' + Date.now(),
        refreshToken: 'jwt_guest_refresh_' + Date.now(),
      },
      {
        id: 'usr_guest',
        email: 'guest@arbaz.dev',
        name: 'Guest Reviewer',
      },
    );
    resetRoot('Main');
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.brandBadge,
              { backgroundColor: colors.primary, borderRadius: radii.md },
            ]}
          >
            <Text style={[styles.brandBadgeText, { color: colors.white }]}>
              {APP_IDENTITY.shortName}
            </Text>
          </View>
          <Text
            style={[
              typography.headlineLarge,
              { color: colors.textPrimary, marginTop: spacing.md },
            ]}
          >
            Welcome Back
          </Text>
          <Text
            style={[
              typography.bodyMedium,
              { color: colors.textSecondary, marginTop: spacing.xs },
            ]}
          >
            Sign in to access your {APP_IDENTITY.appName} workspace.
          </Text>
        </View>

        {/* Demo Credentials Helper Pill */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setEmail('demo@example.com');
            setPassword('password123');
            setErrorMessage(null);
          }}
          style={[
            styles.demoPill,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.sm,
              padding: spacing.sm,
              marginTop: spacing.lg,
            },
          ]}
        >
          <Text style={[typography.labelSmall, { color: colors.primary }]}>
            ⚡ Tap here to autofill portfolio demo credentials
          </Text>
        </TouchableOpacity>

        {/* Error Alert */}
        {errorMessage ? (
          <View
            style={[
              styles.errorBanner,
              {
                backgroundColor: colors.errorBg,
                borderColor: colors.borderError,
                borderRadius: radii.sm,
                padding: spacing.sm,
                marginTop: spacing.md,
              },
            ]}
          >
            <Text style={[typography.bodySmall, { color: colors.error }]}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Form Inputs */}
        <View style={[styles.form, { marginTop: spacing.lg }]}>
          <Text
            style={[
              typography.labelMedium,
              { color: colors.textSecondary, marginBottom: spacing.xs },
            ]}
          >
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.bgInput,
                borderColor: colors.border,
                color: colors.textPrimary,
                borderRadius: radii.md,
                padding: spacing.md,
              },
            ]}
            placeholder="client@company.com"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text
            style={[
              typography.labelMedium,
              {
                color: colors.textSecondary,
                marginTop: spacing.md,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Password
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.bgInput,
                borderColor: colors.border,
                color: colors.textPrimary,
                borderRadius: radii.md,
                padding: spacing.md,
              },
            ]}
            placeholder="••••••••••••"
            placeholderTextColor={colors.textTertiary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Submit Actions */}
        <View style={[styles.actions, { marginTop: spacing.xl }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={isSubmitting}
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                borderRadius: radii.md,
                paddingVertical: spacing.md,
              },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={[styles.primaryButtonText, { color: colors.white }]}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleQuickGuest}
            style={[
              styles.guestButton,
              {
                borderColor: colors.border,
                borderRadius: radii.md,
                paddingVertical: spacing.sm,
                marginTop: spacing.md,
              },
            ]}
          >
            <Text style={[styles.guestButtonText, { color: colors.textPrimary }]}>
              Explore as Guest Reviewer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Signup')}
            style={[styles.switchLink, { marginTop: spacing.lg }]}
          >
            <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                Create Account
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginTop: 10,
  },
  brandBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  brandBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  demoPill: {
    borderWidth: 1,
  },
  errorBanner: {
    borderWidth: 1,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    fontSize: 16,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
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
  guestButton: {
    width: '100%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchLink: {
    alignItems: 'center',
  },
});
