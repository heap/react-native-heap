module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
    '\\.(js|jsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](android|dist|examples|ios|node_modules|integration-tests)[/\\\\]',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>[/\\\\](android|dist|examples|ios|integration-tests)[/\\\\]',
  ],

  testRegex: '__tests__/.*\\.(ts|tsx|js|jsx)$',
};
