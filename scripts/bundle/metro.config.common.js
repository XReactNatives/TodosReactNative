const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const baseConfig = require('./metro.config.base');

const projectRoot = path.resolve(__dirname, '../../');
const buildConfig = {type: baseConfig.BUILD_TYPE.COMMON};

const config = {
  serializer: {
    createModuleIdFactory: baseConfig.buildCreateModuleIdFactory(buildConfig),
    processModuleFilter: baseConfig.buildProcessModuleFilter(buildConfig),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
