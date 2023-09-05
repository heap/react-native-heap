module.exports = (api) => {
  api.cache(false);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      'add-react-displayname',
      './node_modules/@heap/react-native-heap/instrumentor/src/index.js',
    ],
  };
};
