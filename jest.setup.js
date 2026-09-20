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

// Mock checkAppVersion in test environment
jest.mock('@/app/bootstrap/versionCheck', () => ({
  checkAppVersion: jest.fn().mockResolvedValue('UP_TO_DATE'),
}));

// Mock react-native-keychain
jest.mock('react-native-keychain', () => {
  const memoryStore = {};
  return {
    SECURITY_LEVEL: {},
    ACCESSIBLE: {
      WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WhenUnlockedThisDeviceOnly',
    },
    setGenericPassword: jest.fn((username, password, options = {}) => {
      const service = options.service || 'default';
      memoryStore[service] = { username, password };
      return Promise.resolve(true);
    }),
    getGenericPassword: jest.fn((options = {}) => {
      const service = options.service || 'default';
      return Promise.resolve(memoryStore[service] || false);
    }),
    resetGenericPassword: jest.fn((options = {}) => {
      const service = options.service || 'default';
      delete memoryStore[service];
      return Promise.resolve(true);
    }),
  };
});
