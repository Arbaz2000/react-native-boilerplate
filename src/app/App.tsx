/**
 * src/app/App.tsx
 *
 * App-level composition root.
 * Wraps unified AppProviders (SafeArea, Redux, ReactQuery, Theme)
 * and renders AppNavigator.
 */

import React from 'react';
import { AppProviders } from './providers';
import { AppNavigator } from './AppNavigator';

export function App() {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}

export default App;
