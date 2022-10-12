import NavigationUtil from './navigationUtil';

const { Platform } = require('react-native');

const { version } = require('../../package.json');

let reactNativeVersionString: String | null = null;

if (Platform && Platform.constants && Platform.constants.reactNativeVersion) {
  const { major, minor, patch } = Platform.constants.reactNativeVersion;

  reactNativeVersionString = `${major}.${minor}.${patch}`;
}

export const getMetadataProps = () => {
  return {
    source_version: version,
    is_using_react_navigation_hoc: NavigationUtil.isHocEnabled(),
    react_native_version: reactNativeVersionString,
  };
};
