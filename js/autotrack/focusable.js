import hoistNonReactStatic from 'hoist-non-react-statics';
import * as React from 'react';
import { bailOnError } from '../util/bailer';
import { getComponentDisplayName } from '../util/hocUtil';
import { getBaseComponentProps } from './common';

export const withHeapFocusableAutocapture = track => FocusableComponent => {
  class HeapFocusableAutocapture extends React.Component {
    trackEvent() {
      const autotrackProps = getBaseComponentProps(this);

      if (!autotrackProps) {
        // We're not capturing this interaction.
        return;
      }

      track('touch', autotrackProps);
    }

    render() {
      const { heapForwardedRef, onFocus, ...rest } = this.props;

      return (
        <FocusableComponent
          ref={heapForwardedRef}
          onFocus={e => {
            bailOnError(() => this.trackEvent(false))();

            onFocus && onFocus(e);
          }}
          {...rest}
        >
          {this.props.children}
        </FocusableComponent>
      );
    }
  }

  HeapFocusableAutocapture.displayName = `withHeapFocusableAutocapture(${getComponentDisplayName(
    FocusableComponent
  )})`;

  const forwardRefHoc = React.forwardRef((props, ref) => {
    return <HeapFocusableAutocapture {...props} heapForwardedRef={ref} />;
  });

  hoistNonReactStatic(forwardRefHoc, FocusableComponent);

  return forwardRefHoc;
};
