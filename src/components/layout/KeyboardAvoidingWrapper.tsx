/**
 * src/components/layout/KeyboardAvoidingWrapper.tsx
 *
 * Cross-platform keyboard avoiding layout wrapper.
 * Features:
 *   - Auto dismisses keyboard when tapping outside inputs
 *   - Platform-tuned behavior (iOS padding vs Android default)
 *   - ScrollView with keyboardShouldPersistTaps="handled"
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  keyboardVerticalOffset?: number | undefined;
}

export function KeyboardAvoidingWrapper({
  children,
  contentContainerStyle,
  style,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0,
}: KeyboardAvoidingWrapperProps): React.JSX.Element {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[styles.container, style]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
