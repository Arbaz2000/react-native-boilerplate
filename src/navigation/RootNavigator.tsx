/**
 * src/navigation/RootNavigator.tsx
 *
 * Top-level root stack navigator.
 * Registers:
 *   - Splash (cold-start gating)
 *   - Onboarding (welcome carousel)
 *   - Auth (login / signup)
 *   - Main (5-tab bottom bar)
 *   - UpdateRequired (non-dismissible modal)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

// Screens & Sub-navigators
import { SplashScreen } from '@/screens/splash/SplashScreen';
import { OnboardingStack } from './OnboardingStack';
import { AuthStack } from './AuthStack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { UpdateRequiredModal } from '@/screens/update-required/UpdateRequiredModal';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingStack}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="UpdateRequired"
        component={UpdateRequiredModal}
        options={{
          gestureEnabled: false,
          animation: 'fade',
        }}
      />
    </Stack.Navigator>
  );
}
