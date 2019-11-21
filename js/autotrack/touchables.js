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

  if (touchState === 'RESPONDER_ACTIVE_LONG_PRESS_IN') {
    // We already captured this touch when the 'touchableHandleLongPress' hook fired, so don't capture this event.
    return;
  }

  autotrackProps.touch_state = touchState;
  autotrackProps.is_long_press = eventType === 'touchableHandleLongPress';

  track('touch', autotrackProps);
};
