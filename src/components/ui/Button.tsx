/**
 * src/components/ui/Button.tsx
 *
 * Core design system Button component.
 * Features:
 *   - 5 variants: primary, secondary, outline, ghost, danger
 *   - 3 sizes: sm, md, lg (all meeting min 48dp touch targets on default/lg)
 *   - Loading state with ActivityIndicator
 *   - Disabled state styling
 *   - Left and right icon support
 *   - Fully theme-token driven (zero hardcoded colors)
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  leftIcon?: React.ReactNode | undefined;
  rightIcon?: React.ReactNode | undefined;
  fullWidth?: boolean | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  textStyle?: StyleProp<TextStyle> | undefined;
  testID?: string | undefined;
  accessibilityLabel?: string | undefined;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: ButtonProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useAppTheme();

  // Variant styling resolver
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; indicatorColor: string } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.bgSecondary,
            borderColor: colors.border,
            borderWidth: 1,
          },
          text: {
            color: colors.textPrimary,
          },
          indicatorColor: colors.textPrimary,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: colors.primary,
            borderWidth: 1.5,
          },
          text: {
            color: colors.primary,
          },
          indicatorColor: colors.primary,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: colors.primary,
          },
          indicatorColor: colors.primary,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.error,
            borderWidth: 0,
          },
          text: {
            color: colors.white,
          },
          indicatorColor: colors.white,
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: colors.primary,
            borderWidth: 0,
          },
          text: {
            color: colors.white,
          },
          indicatorColor: colors.white,
        };
    }
  };

  // Size styling resolver
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.md,
            minHeight: 36,
          },
          text: {
            fontSize: typography.labelMedium.fontSize,
            lineHeight: typography.labelMedium.lineHeight,
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.xxl,
            minHeight: 56,
          },
          text: {
            fontSize: typography.titleMedium.fontSize,
            lineHeight: typography.titleMedium.lineHeight,
          },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.xl,
            minHeight: 48,
          },
          text: {
            fontSize: typography.labelLarge.fontSize,
            lineHeight: typography.labelLarge.lineHeight,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.75}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.baseContainer,
        {
          borderRadius: radii.md,
          width: fullWidth ? '100%' : 'auto',
          opacity: isDisabled ? 0.55 : 1,
        },
        variantStyles.container,
        sizeStyles.container,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.indicatorColor} size="small" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.baseText,
              {
                fontWeight: typography.labelLarge.fontWeight,
                marginHorizontal: leftIcon || rightIcon ? spacing.xs : 0,
              },
              variantStyles.text,
              sizeStyles.text,
              textStyle,
            ]}
          >
            {label}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
