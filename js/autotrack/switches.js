import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { getBaseComponentProps } from './common';
import { swallowErrors } from '../util/bailer';
import { getComponentDisplayName } from '../util/hocUtil';

export const autotrackSwitchChange = track => (
  eventType,
  componentThis,
  event
) => {
  const autotrackProps = getBaseComponentProps(componentThis);

  if (!autotrackProps) {
    // We're not capturing this interaction.
    return;
  }

  track(eventType, autotrackProps);
};

export const withHeapSwitchAutocapture = track => SwitchComponent => {
  class HeapSwitchAutocapture extends React.Component {
    trackEvent() {
      const autotrackProps = getBaseComponentProps(this);

      if (!autotrackProps) {
        // We're not capturing this interaction.
        return;
      }

      track('change', autotrackProps);
    }

    render() {
      const { heapForwardedRef, onValueChange, ...rest } = this.props;

      return (
        <SwitchComponent
          ref={heapForwardedRef}
          onValueChange={value => {
            swallowErrors(() => this.trackEvent())();

            onValueChange && onValueChange(value);
          }}
          {...rest}
        >
          {this.props.children}
        </SwitchComponent>
      );
    }
  }

  const displayName = getComponentDisplayName(SwitchComponent);

  HeapSwitchAutocapture.displayName = `withHeapSwitchAutocapture(${displayName})`;

  const forwardRefHoc = React.forwardRef((props, ref) => {
    return <HeapSwitchAutocapture {...props} heapForwardedRef={ref} />;
  });

  hoistNonReactStatic(forwardRefHoc, SwitchComponent);
  forwardRefHoc.displayName = displayName;

  return forwardRefHoc;
};
