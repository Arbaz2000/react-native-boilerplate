/**
 * src/components/ui/Input.tsx
 *
 * Core design system text input component.
 * Features:
 *   - Focus state border highlighting
 *   - Error message display with error semantic styling
 *   - Helper text support
 *   - Password show/hide toggle for secureTextEntry
 *   - Left and right accessory icons
 *   - Fully theme-token driven
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string | undefined;
  error?: string | undefined;
  helperText?: string | undefined;
  leftIcon?: React.ReactNode | undefined;
  rightIcon?: React.ReactNode | undefined;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  inputStyle?: StyleProp<TextStyle> | undefined;
  isPassword?: boolean | undefined;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  isPassword = false,
  secureTextEntry,
  testID,
  ...rest
}: InputProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldHideText = isPassword ? !isPasswordVisible : secureTextEntry;

  // Determine border color
  let borderColor = colors.border;
  if (error) {
    borderColor = colors.error;
  } else if (isFocused) {
    borderColor = colors.primary;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error ? colors.error : colors.textSecondary,
              fontSize: typography.labelMedium.fontSize,
              fontWeight: typography.labelMedium.fontWeight,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.bgInput,
            borderColor,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        {leftIcon && <View style={{ marginRight: spacing.xs }}>{leftIcon}</View>}

        <TextInput
          testID={testID}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={shouldHideText}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.textInput,
            {
              color: colors.textPrimary,
              fontSize: typography.bodyMedium.fontSize,
              paddingVertical: spacing.sm,
            },
            inputStyle,
          ]}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            testID={testID ? `${testID}-toggle-password` : undefined}
            activeOpacity={0.7}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            style={[styles.iconButton, { padding: spacing.xs }]}
          >
            <Text style={{ fontSize: 16 }}>{isPasswordVisible ? '👁️' : '🔒'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={{ marginLeft: spacing.xs }}>{rightIcon}</View>
        ) : null}
      </View>

      {error ? (
        <Text
          style={[
            styles.messageText,
            {
              color: colors.error,
              fontSize: typography.bodySmall.fontSize,
              marginTop: spacing.xxs,
            },
          ]}
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            styles.messageText,
            {
              color: colors.textTertiary,
              fontSize: typography.bodySmall.fontSize,
              marginTop: spacing.xxs,
            },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    letterSpacing: 0.1,
  },
});
