/**
 * src/components/feedback/Toast.tsx
 *
 * Global toast notification banner.
 * Listens to useUIStore toast state and animates smoothly from top of screen.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@/store/zustand/useUIStore';
import { useAppTheme } from '@/theme/useAppTheme';

export function Toast(): React.JSX.Element | null {
  const toast = useUIStore((state) => state.activeToast);
  const hideToast = useUIStore((state) => state.hideToast);
  const { colors, spacing, radii, typography } = useAppTheme();
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast, translateY, opacity]);

  if (!toast) {
    return null;
  }

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: colors.success,
          icon: '✅',
          border: colors.success,
        };
      case 'error':
        return {
          bg: colors.error,
          icon: '❌',
          border: colors.error,
        };
      case 'warning':
        return {
          bg: colors.warning,
          icon: '⚠️',
          border: colors.warning,
        };
      case 'info':
      default:
        return {
          bg: colors.primary,
          icon: 'ℹ️',
          border: colors.primary,
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      testID="global-toast"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          top: insets.top + spacing.sm,
          transform: [{ translateY }],
          opacity,
          backgroundColor: colors.surface,
          borderColor: typeStyles.border,
          borderRadius: radii.lg,
          padding: spacing.md,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <Text style={styles.icon}>{typeStyles.icon}</Text>
        <Text
          numberOfLines={2}
          style={[
            styles.message,
            {
              color: colors.textPrimary,
              fontSize: typography.bodyMedium.fontSize,
              lineHeight: typography.bodyMedium.lineHeight,
              marginHorizontal: spacing.sm,
            },
          ]}
        >
          {toast.message}
        </Text>
        <TouchableOpacity
          testID="toast-dismiss-btn"
          activeOpacity={0.7}
          onPress={hideToast}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          style={[styles.closeButton, { padding: spacing.xxs }]}
        >
          <Text style={{ color: colors.textTertiary, fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
  },
  message: {
    flex: 1,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
