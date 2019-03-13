const reactNative = jest.genMockFromModule('react-native');

reactNative.NativeModules = {
  RNHeap: {
    track: jest.fn(),
  },
};

module.exports = reactNative;
