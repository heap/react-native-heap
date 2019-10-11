import { getBaseComponentProps } from './common';

export const autotrackPress = track => (eventType, componentThis, event) => {
  const autotrackProps = getBaseComponentProps(componentThis);

  if (!autotrackProps) {
    // We're not capturing this interaction.
    return;
  }

  const touchState =
    componentThis &&
    componentThis.state &&
    componentThis.state.touchable &&
    componentThis.state.touchable.touchState;

  autotrackProps.touch_state = touchState;
  autotrackProps.is_long_press = eventType === 'touchableHandleLongPress';

  track('touch', autotrackProps);
};
