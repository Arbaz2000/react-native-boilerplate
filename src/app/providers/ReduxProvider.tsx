/**
 * src/app/providers/ReduxProvider.tsx
 *
 * Provides the Redux Toolkit store to the React component tree.
 */

import React, { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

type ReduxProviderProps = {
  children: ReactNode;
};

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
