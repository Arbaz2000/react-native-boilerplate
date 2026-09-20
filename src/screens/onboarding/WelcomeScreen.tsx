/**
 * src/screens/onboarding/WelcomeScreen.tsx
 *
 * Full Onboarding Carousel screen.
 * Driven by ONBOARDING_SLIDES in src/config/branding.ts.
 *
 * Features:
 *   - Horizontal paging carousel with responsive slide widths
 *   - Animated pagination dot indicators
 *   - "Skip" action to jump straight to Auth
 *   - "Next" and "Get Started" progression
 *   - Sets hasOnboarded = true on completion and resets navigation to Auth
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/theme/useAppTheme';
import { useOnboardingStore } from '@/store/zustand/useOnboardingStore';
import { resetRoot } from '@/navigation/navigationRef';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { ONBOARDING_SLIDES, type OnboardingSlide } from '@/config/branding';
import type { OnboardingStackScreenProps } from '@/navigation/types';

export function WelcomeScreen({}: OnboardingStackScreenProps<'Welcome'>) {
  const { colors, spacing, radii, typography } = useAppTheme();
  const { width } = useWindowDimensions();
  const setHasOnboarded = useOnboardingStore((state) => state.setHasOnboarded);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const handleFinishOnboarding = () => {
    setHasOnboarded(true);
    resetRoot('Auth');
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinishOnboarding();
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <SafeScreen edges={['top', 'left', 'right', 'bottom']}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Bar with Skip */}
        <View style={[styles.topBar, { paddingHorizontal: spacing.xl, paddingTop: spacing.sm }]}>
        <View style={styles.topBarSpacer} />
        {!isLastSlide ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleFinishOnboarding}
            style={styles.skipButton}
          >
            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipButtonPlaceholder} />
        )}
      </View>

      {/* Paging Carousel */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slideContainer, { width, paddingHorizontal: spacing.xl }]}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radii.xl,
                },
              ]}
            >
              <Text style={styles.iconGlyph}>{item.icon}</Text>
            </View>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: colors.primary + '18',
                  borderRadius: radii.full,
                  marginTop: spacing.xl,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {item.badge}
              </Text>
            </View>

            <Text
              style={[
                typography.headlineMedium,
                {
                  color: colors.textPrimary,
                  marginTop: spacing.md,
                  textAlign: 'center',
                },
              ]}
            >
              {item.title}
            </Text>

            <Text
              style={[
                typography.bodyLarge,
                {
                  color: colors.textSecondary,
                  marginTop: spacing.sm,
                  textAlign: 'center',
                  paddingHorizontal: spacing.md,
                },
              ]}
            >
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Bottom Pagination & Navigation */}
      <View style={[styles.bottomBar, { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl }]}>
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={slide.id}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive ? colors.primary : colors.border,
                    width: isActive ? 24 : 8,
                    borderRadius: radii.full,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.md,
              paddingVertical: spacing.md,
              marginTop: spacing.xl,
            },
          ]}
        >
          <Text style={[styles.actionButtonText, { color: colors.white }]}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarSpacer: {
    width: 48,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipButtonPlaceholder: {
    width: 48,
    height: 32,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconGlyph: {
    fontSize: 54,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bottomBar: {
    width: '100%',
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
  },
  dot: {
    height: 8,
    marginHorizontal: 4,
  },
  actionButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
