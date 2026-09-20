/**
 * src/navigation/BottomTabNavigator.tsx
 *
 * Config-driven bottom tab bar navigator.
 * Spec §1, §2, §9:
 *   - 5 tabs driven completely by `TABS` array in `tabs.config.ts`
 *   - Adding or removing a tab is a 1-line change in tabs.config.ts
 *   - Zero hardcoded navigator changes required when reconfiguring slots
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@/theme/useAppTheme';
import { TABS } from '@/config/tabs.config';
import type { BottomTabParamList } from './types';

// Screens
import { HomeScreen } from '@/screens/home/HomeScreen';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { ExploreScreen } from '@/screens/explore/ExploreScreen';
import { ChatScreen } from '@/screens/chat/ChatScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

/**
 * Screen component lookup table.
 * Resolves each configured tab name to its corresponding screen component.
 */
const TAB_COMPONENTS: Record<keyof BottomTabParamList, React.ComponentType<any>> = {
  Home: HomeScreen,
  Dashboard: DashboardScreen,
  Explore: ExploreScreen,
  Chat: ChatScreen,
  Settings: SettingsScreen,
};

/**
 * Icon glyph map for baseline rendering before custom vector icons are wired.
 */
const TAB_ICON_GLYPHS: Record<string, string> = {
  home: '⌂',
  'bar-chart': '📊',
  compass: '🧭',
  message: '💬',
  settings: '⚙',
};

function TabGlyphIcon({ icon, color }: { icon: string; color: string }) {
  const glyph = TAB_ICON_GLYPHS[icon] ?? '●';
  return <Text style={[styles.tabIcon, { color }]}>{glyph}</Text>;
}

export function BottomTabNavigator() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const tabConfig = TABS.find((t) => t.name === route.name);
        return {
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            elevation: 8,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            paddingTop: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 4,
          },
          tabBarIcon: ({ color }) => <TabGlyphIcon icon={tabConfig?.icon ?? ''} color={color} />,
        };
      }}
    >
      {TABS.map((tab) => {
        const ScreenComponent = TAB_COMPONENTS[tab.name];
        if (!ScreenComponent) {
          console.warn(`[BottomTabNavigator] No component registered for tab: ${tab.name}`);
          return null;
        }

        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={ScreenComponent}
            options={{
              title: tab.label,
              tabBarLabel: tab.label,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});
