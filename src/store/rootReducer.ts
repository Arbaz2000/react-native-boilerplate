/**
 * src/store/rootReducer.ts
 *
 * Primary Redux root reducer.
 * Combines RTK Query API slice reducers and feature slices.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/auth.api';
import { remoteConfigApi } from '@/features/app-config/remote-config.api';
import appConfigReducer, { appConfigSlice } from '@/features/app-config/app-config.slice';

export const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [remoteConfigApi.reducerPath]: remoteConfigApi.reducer,
  [appConfigSlice.name]: appConfigReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
