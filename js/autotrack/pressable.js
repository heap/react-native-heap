import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { getBaseComponentProps } from './common';
import { bailOnError } from '../util/bailer';
import { getComponentDisplayName } from '../util/hocUtil';

export const withHeapPressableAutocapture = track => PressableComponent => {
  class HeapPressableAutocapture extends React.Component {
    trackEvent(isLongPress) {
      const autotrackProps = getBaseComponentProps(this);

      if (!autotrackProps) {
        // We're not capturing this interaction.
        return;
      }

      autotrackProps.is_long_press = isLongPress;

      track('touch', autotrackProps);
    }

    render() {
      const { heapForwardedRef, onPress, onLongPress, ...rest } = this.props;

      return (
        <PressableComponent
          ref={heapForwardedRef}
          onPress={e => {
            bailOnError(() => this.trackEvent(false))();

            onPress && onPress(e);
          }}
          onLongPress={e => {
            bailOnError(() => this.trackEvent(true))();

            onLongPress && onLongPress(e);
          }}
          {...rest}
        >
          {this.props.children}
        </PressableComponent>
      );
    }
  }

  HeapPressableAutocapture.displayName = `withHeapPressableAutocapture(${getComponentDisplayName(
    PressableComponent
  )})`;

  const forwardRefHoc = React.forwardRef((props, ref) => {
    return <HeapPressableAutocapture {...props} heapForwardedRef={ref} />;
  });

  hoistNonReactStatic(forwardRefHoc, PressableComponent);

  return forwardRefHoc;
};
