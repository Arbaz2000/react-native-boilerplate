/**
 * src/mocks/server.ts
 *
 * Mock Service Worker server instance for React Native & Jest test environments.
 */

import { setupServer } from 'msw/native';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
