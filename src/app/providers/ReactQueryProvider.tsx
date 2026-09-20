/**
 * src/app/providers/ReactQueryProvider.tsx
 *
 * Provides TanStack React Query client to the React component tree.
 * Spec §7: Secondary async server state layer for one-off fetches, polling,
 * and client-specific data isolated from Redux.
 */

import React, { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type ReactQueryProviderProps = {
  children: ReactNode;
};

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // Create QueryClient once per component tree lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
