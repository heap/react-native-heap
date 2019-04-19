import { getBaseComponentProps } from './common';

export const autotrackPress = track => (eventType, componentThis, event) => {
  const touchState =
    componentThis &&
    componentThis.state &&
    componentThis.state.touchable &&
    componentThis.state.touchable.touchState;

  const autotrackProps = {
    ...getBaseComponentProps(componentThis),
    touchState,
  };

  track(eventType, autotrackProps);
};
