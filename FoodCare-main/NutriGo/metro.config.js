const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    // Add custom transformers here if needed
  },
  resolver: {
    ...defaultConfig.resolver,
    // Add custom resolvers here if needed
  },
};
