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
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
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
  const insets = useSafeAreaInsets();

  const fallbackStatusBar = Platform.OS === 'android' ? 24 : 0;
  const statusBarHeight =
    Platform.OS === 'android'
      ? (StatusBar.currentHeight ?? fallbackStatusBar)
      : 0;
  const needsTopPadding =
    edges?.includes('top') && insets.top === 0 && statusBarHeight > 0;

  return (
    <SafeAreaView
      testID={testID}
      edges={edges}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: needsTopPadding ? statusBarHeight : 0,
        },
        style,
      ]}
    >
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
