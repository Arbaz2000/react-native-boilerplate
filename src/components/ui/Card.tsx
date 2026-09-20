/**
 * src/components/ui/Card.tsx
 *
 * Core design system Card component.
 * Features:
 *   - 3 variants: elevated, outlined, flat
 *   - Optional onPress handler turning card into interactive touchable
 *   - Themed surface and shadow integration
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';

export type CardVariant = 'elevated' | 'outlined' | 'flat';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant | undefined;
  onPress?: (() => void) | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  testID?: string | undefined;
  accessibilityLabel?: string | undefined;
}

export function Card({
  children,
  variant = 'outlined',
  onPress,
  style,
  testID,
  accessibilityLabel,
}: CardProps): React.JSX.Element {
  const { colors, spacing, radii } = useAppTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          borderWidth: 0,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'flat':
        return {
          backgroundColor: colors.bgSecondary,
          borderWidth: 0,
        };
      case 'outlined':
      default:
        return {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        };
    }
  };

  const cardStyle: ViewStyle[] = [
    styles.cardBase,
    {
      borderRadius: radii.lg,
      padding: spacing.lg,
    },
    getVariantStyles(),
    (style as ViewStyle) || {},
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        activeOpacity={0.8}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    marginVertical: 6,
    width: '100%',
  },
});
