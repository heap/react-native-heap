import { getBaseComponentProps } from './common';
import * as _ from 'lodash';

export const autotrackScrollView = track => (
  eventType,
  componentThis,
  event
) => {
  if (!componentThis.props.pagingEnabled) {
    // Only capture events with 'pagingEnabled'. Similar events might occur with configurations that
    // use 'snapTo*', but these require additional logic when determining properties like
    // 'pageIndex'.
    return;
  }

  // Target text on a scrollview will be the entire contents of the scrollview, which isn't
  // particularly meaningful. Just leave out the target text.
  const autotrackProps = _.omit(
    getBaseComponentProps(componentThis),
    'target_text'
  );

  if (!autotrackProps) {
    // We're not capturing this interaction.
    return;
  }

  const pageIndex =
    event.nativeEvent.contentOffset.x /
    event.nativeEvent.layoutMeasurement.width;

  // Integer props on android seem to come into Heap as decimals (regardless of whether the number is actually a float), while integer props
  // on iOS come into Heap as integers. To keep this prop consistent across platforms, send it as a string.
  autotrackProps.page_index = `${Math.round(pageIndex)}`;

  track(eventType, autotrackProps);
};
