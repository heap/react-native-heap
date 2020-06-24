module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'add-react-displayname',
    './node_modules/@heap/react-native-heap/instrumentor/src/index.js',
  ],
};
