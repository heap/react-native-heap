import { getBaseComponentProps } from './common';
import * as _ from 'lodash';

export const autotrackScrollView = track => (eventType, componentThis, event) => {
  if (!componentThis.props.pagingEnabled) {
    // Only capture events with 'pagingEnabled'. Similar events might occur with configurations that
    // use 'snapTo*', but these require additional logic when determining properties like
    // 'pageIndex'.
    return;
  }

  // Target text in a scrollview will be the entire contents of the scrollview, which isn't
  // particularly meaningful. Just leave out the target text.
  const autotrackProps = _.omit(getBaseComponentProps(componentThis), 'targetText');

  if (!autotrackProps) {
    // We're not capturing this interaction.
    return;
  }

  track(eventType, autotrackProps);
};
