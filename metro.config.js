const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        inlineRequires: true,
        nonInlinedRequires: [
          'React',
          'react',
          'react-native',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ],
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
