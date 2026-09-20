const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const projectRoot = __dirname;

const config = {
  // Watch assets/branding and any future monorepo packages
  watchFolders: [path.resolve(projectRoot, 'assets')],

  resolver: {
    // Add extra source extensions here if needed (e.g. 'cjs' for some libs)
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

