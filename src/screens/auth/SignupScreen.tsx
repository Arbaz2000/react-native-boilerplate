/**
 * src/screens/auth/SignupScreen.tsx
 *
 * Full Authentication Registration screen.
 * References:
 *   - RN-Freelance-Boilerplate-Setup.md (§1)
 *   - App-Identity-Rebranding-Strategy.md (§1)
 *
 * Features:
 *   - Interactive Full Name, Email & Password inputs with validation
 *   - Terms & Privacy policy acknowledgement
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
import { APP_IDENTITY } from '@/config/branding';
import type { AuthStackScreenProps } from '@/navigation/types';

export function SignupScreen({ navigation }: AuthStackScreenProps<'Signup'>) {
  const { colors, spacing, radii, typography } = useAppTheme();
  const setSession = useAuthStore((state) => state.setSession);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = () => {
    setErrorMessage(null);
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSession(
        {
          accessToken: 'jwt_mock_signup_access_' + Date.now(),
          refreshToken: 'jwt_mock_signup_refresh_' + Date.now(),
        },
        {
          id: 'usr_new_' + Date.now(),
          email: email.trim(),
          name: name.trim(),
        },
      );
      resetRoot('Main');
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[typography.headlineLarge, { color: colors.textPrimary }]}>
            Create Account
          </Text>
          <Text
            style={[
              typography.bodyMedium,
              { color: colors.textSecondary, marginTop: spacing.xs },
            ]}
          >
            Get started with {APP_IDENTITY.appName}.
          </Text>
        </View>

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

        <View style={[styles.form, { marginTop: spacing.lg }]}>
          <Text
            style={[
              typography.labelMedium,
              { color: colors.textSecondary, marginBottom: spacing.xs },
            ]}
          >
            Full Name
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
            placeholder="John Doe"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
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
            placeholder="john@example.com"
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
            placeholder="At least 6 characters"
            placeholderTextColor={colors.textTertiary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Text
          style={[
            typography.bodySmall,
            { color: colors.textTertiary, marginTop: spacing.md, textAlign: 'center' },
          ]}
        >
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </Text>

        <View style={[styles.actions, { marginTop: spacing.xl }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignup}
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
            style={[styles.switchLink, { marginTop: spacing.lg }]}
          >
            <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
              Already have an account?{' '}
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  switchLink: {
    alignItems: 'center',
  },
});
