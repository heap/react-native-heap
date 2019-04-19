import { getBaseComponentProps } from './common';

export const autotrackSwitchChange = track => (
  eventType,
  componentThis,
  event
) => {
  const autotrackProps = getBaseComponentProps(componentThis);

  track(eventType, autotrackProps);
};
