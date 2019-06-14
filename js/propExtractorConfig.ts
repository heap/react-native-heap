import * as _ from 'lodash';

import { PropExtractorConfig } from './util/extractProps';
import { REACT_NATIVE_ELEMENTS_CONFIG } from './libraryPropConfigs/rnElementsPropConfig';
import { NATIVE_BASE_CONFIG } from './libraryPropConfigs/nativeBasePropConfig';

const BASE_CONFIG: PropExtractorConfig = {
  '*': {
    include: ['testID'],
    exclude: [],
  },
  Button: {
    include: ['title'],
    exclude: [],
  },
};

const propConfigMerger = (objValue: any, srcValue: any) => {
  if (_.isArray(objValue)) {
    return _.union(objValue, srcValue);
  }
};

// :TODO: (jmtaber129): Consider allowing users to specify whether library-specific prop configs are
// included in the default config.
const builtinPropExtractorConfig: PropExtractorConfig = _.mergeWith(
  {},
  BASE_CONFIG,
  REACT_NATIVE_ELEMENTS_CONFIG,
  NATIVE_BASE_CONFIG,
  propConfigMerger
);

export { builtinPropExtractorConfig };
