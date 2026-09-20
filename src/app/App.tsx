/**
 * src/app/App.tsx
 *
 * App-level composition root.
 * Wraps top-level providers (SafeAreaProvider, ThemeProvider)
 * and renders AppNavigator.
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme/ThemeContext';
import { AppNavigator } from './AppNavigator';

export function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
