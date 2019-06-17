import { getBaseComponentProps } from './common';

export const autotrackScrollView = track => (eventType, componentThis, event) => {
  if (!componentThis.props.pagingEnabled) {
    // Only capture events with 'pagingEnabled'. Similar events might occur with configurations that
    // use 'snapTo*', but these require additional logic when determining properties like
    // 'pageIndex'.
    return;
  }

  const autotrackProps = getBaseComponentProps(componentThis);

  if (!autotrackProps) {
    // We're not capturing this interaction.
    return;
  }

  track(eventType, autotrackProps);
};
