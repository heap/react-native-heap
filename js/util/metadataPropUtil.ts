import NavigationUtil from './navigationUtil';

const { version } = require('../../package.json');

export const getMetadataProps = () => {
  return {
    source_version: version,
    is_using_react_navigation_hoc: NavigationUtil.isEnabled(),
  };
};
