/**
 * src/store/index.ts
 *
 * Central Redux store configuration.
 * Spec §2 line 108, §7:
 *   - Combines RTK Query (authApi, remoteConfigApi) with application feature slices
 *   - Enables RTK Query refetchOnFocus / refetchOnReconnect via setupListeners
 *   - Exports strictly typed hooks (useAppDispatch, useAppSelector)
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import { rootReducer } from './rootReducer';
import { authApi } from '@/features/auth/auth.api';
import { remoteConfigApi } from '@/features/app-config/remote-config.api';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, remoteConfigApi.middleware),
});

// Enable listener behavior for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Pre-typed dispatch hook for the application.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Pre-typed selector hook for the application.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
