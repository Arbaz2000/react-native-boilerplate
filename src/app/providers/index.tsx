/**
 * src/app/providers/index.tsx
 *
 * Unified Provider composition root.
 * Spec §2 line 60-64:
 *   <AppProviders> wraps:
 *     - SafeAreaProvider (device insets)
 *     - ReduxProvider (RTK Query + Redux store)
 *     - ReactQueryProvider (TanStack React Query cache)
 *     - ThemeProvider (app design tokens & color scheme)
 */

import React, { type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReduxProvider } from './ReduxProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';

import { Toast } from '@/components/feedback/Toast';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <ReactQueryProvider>
          <ThemeProvider>
            {children}
            <Toast />
          </ThemeProvider>
        </ReactQueryProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}

export { ReduxProvider } from './ReduxProvider';
export { ReactQueryProvider } from './ReactQueryProvider';
export { ThemeProvider } from './ThemeProvider';
