/**
 * src/animations/transitions.ts
 *
 * Shared animation presets and transition primitives.
 * Spec §2 line 138:
 *   - Shared timing, spring, and easing configurations
 *   - Reusable animation orchestrators compatible across all platforms
 */

import { Animated, Easing } from 'react-native';

export const DURATION = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

export const SPRING_CONFIG = {
  bouncy: {
    tension: 120,
    friction: 8,
    useNativeDriver: true,
  },
  smooth: {
    tension: 80,
    friction: 12,
    useNativeDriver: true,
  },
  snappy: {
    tension: 160,
    friction: 14,
    useNativeDriver: true,
  },
  gentle: {
    tension: 40,
    friction: 10,
    useNativeDriver: true,
  },
} as const;

/**
 * Fade in an animated value from current opacity to 1.
 */
export function fadeIn(
  animatedValue: Animated.Value,
  duration: number = DURATION.normal,
): Animated.CompositeAnimation {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
}

/**
 * Fade out an animated value from current opacity to 0.
 */
export function fadeOut(
  animatedValue: Animated.Value,
  duration: number = DURATION.fast,
): Animated.CompositeAnimation {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
}

/**
 * Animate scale with a gentle spring pop effect.
 */
export function springScale(
  animatedValue: Animated.Value,
  toValue: number = 1,
  config: typeof SPRING_CONFIG.snappy = SPRING_CONFIG.snappy,
): Animated.CompositeAnimation {
  return Animated.spring(animatedValue, {
    toValue,
    ...config,
  });
}

/**
 * Creates an infinite pulsating loop (e.g. for loaders, skeletons).
 */
export function createPulseLoop(
  animatedValue: Animated.Value,
  min: number = 0.4,
  max: number = 1.0,
  duration: number = 700,
): Animated.CompositeAnimation {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: max,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: min,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
  );
}
