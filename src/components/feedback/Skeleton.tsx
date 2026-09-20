/**
 * src/components/feedback/Skeleton.tsx
 *
 * Loading skeleton placeholder with continuous pulse animation.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';

export interface SkeletonProps {
  width?: DimensionValue | undefined;
  height?: DimensionValue | undefined;
  borderRadius?: number | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  testID?: string | undefined;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius,
  style,
  testID,
}: SkeletonProps): React.JSX.Element {
  const { colors, radii } = useAppTheme();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.skeletonBase,
        {
          width,
          height,
          borderRadius: borderRadius ?? radii.md,
          backgroundColor: colors.bgTertiary,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeletonBase: {
    marginVertical: 4,
  },
});
