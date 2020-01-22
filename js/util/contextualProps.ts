import NavigationUtil from './navigationUtil';
import { getMetadataProps } from './metadataPropUtil';
import * as _ from 'lodash';

export const getContextualProps = () => {
  return _.merge(
    {},
    getMetadataProps(),
    NavigationUtil.getScreenPropsForCurrentRoute()
  );
};
