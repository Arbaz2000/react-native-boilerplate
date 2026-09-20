/**
 * src/components/layout/SafeScreen.tsx
 *
 * Screen-level safe area container.
 * Features:
 *   - Automatic insets handling via react-native-safe-area-context
 *   - Themed background color and status bar synchronization
 *   - Configurable edges (top, bottom, left, right)
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/useAppTheme';

export interface SafeScreenProps {
  children: React.ReactNode;
  edges?: readonly Edge[] | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  testID?: string | undefined;
}

export function SafeScreen({
  children,
  edges = ['top', 'left', 'right'],
  style,
  testID,
}: SafeScreenProps): React.JSX.Element {
  const { colors, dark } = useAppTheme();

  return (
    <SafeAreaView
      testID={testID}
      edges={edges}
      style={[
        styles.container,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
