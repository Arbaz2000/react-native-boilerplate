/**
 * src/components/layout/TabBarIcon.tsx
 *
 * Tab bar icon component supporting emoji/glyphs, focused color states, and badge notifications.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';

export interface TabBarIconProps {
  name: string;
  focused: boolean;
  color: string;
  size?: number | undefined;
  badgeCount?: number | undefined;
}

const ICON_MAP: Record<string, { focused: string; unfocused: string }> = {
  Home: { focused: '🏠', unfocused: '🏚️' },
  Dashboard: { focused: '📊', unfocused: '📉' },
  Slot3: { focused: '🔍', unfocused: '🔎' },
  Slot4: { focused: '💬', unfocused: '🗨️' },
  Settings: { focused: '⚙️', unfocused: '🔧' },
};

export function TabBarIcon({
  name,
  focused,
  badgeCount,
}: TabBarIconProps): React.JSX.Element {
  const { colors, radii } = useAppTheme();
  const iconPair = ICON_MAP[name];
  const iconText = iconPair
    ? focused
      ? iconPair.focused
      : iconPair.unfocused
    : '📌';

  return (
    <View style={styles.container}>
      <Text style={[styles.iconText, { opacity: focused ? 1 : 0.65 }]}>
        {iconText}
      </Text>

      {Boolean(badgeCount && badgeCount > 0) && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.error,
              borderRadius: radii.full,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.white }]}>
            {badgeCount! > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  iconText: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
