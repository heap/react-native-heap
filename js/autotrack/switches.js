import { getBaseComponentPropsFromComponent } from './common';

export const autotrackSwitchChange = track => (
  eventType,
  componentThis,
  event
) => {
  const autotrackProps = getBaseComponentPropsFromComponent(componentThis);

  if (!autotrackProps) {
    // We're not capturing this interaction.
    return;
  }

  track(eventType, autotrackProps);
};
