/* eslint-disable no-undef */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock react-native-config
jest.mock('react-native-config', () => ({
  Config: {
    APP_ENV: 'development',
    API_BASE_URL: 'https://api.dev.example.com',
    ENABLE_DEBUG_MENU: 'true',
    ENABLE_CRASH_REPORTING: 'false',
    SENTRY_DSN: '',
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
