const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow Metro to bundle .glb files as static assets
config.resolver.assetExts.push('glb', 'gltf', 'bin');

module.exports = config;
