import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { getBaseComponentProps } from './common';
import { bailOnError } from '../util/bailer';
import { getComponentDisplayName } from '../util/hocUtil';

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

export const withHeapTouchableAutocapture = track => TouchableComponent => {
  class HeapTouchableAutocapture extends React.Component {
    render() {
      const { forwardedRef, onPress, onLongPress, ...rest } = this.props;

      return (
        <TouchableComponent
          ref={forwardedRef}
          onPress={e => {
            bailOnError(autotrackPress(track))('touchableHandlePress', this, e);

            onPress && onPress(e);
          }}
          onLongPress={e => {
            bailOnError(autotrackPress(track))(
              'touchableHandleLongPress',
              this,
              e
            );

            onLongPress && onLongPress(e);
          }}
          {...rest}
        >
          {this.props.children}
        </TouchableComponent>
      );
    }
  }

  HeapTouchableAutocapture.displayName = `withHeapTouchableAutocapture(${getComponentDisplayName(
    TouchableComponent
  )})`;

  const forwardRefHoc = React.forwardRef((props, ref) => {
    return <HeapTouchableAutocapture {...props} forwardedRef={ref} />;
  });

  hoistNonReactStatic(forwardRefHoc, TouchableComponent);

  return forwardRefHoc;
};
