import hoistNonReactStatic from 'hoist-non-react-statics';
import * as React from 'react';
import { bailOnError } from '../util/bailer';
import { getComponentDisplayName } from '../util/hocUtil';
import { getBaseComponentProps } from './common';

export const withHeapAutocapture = track => (
  CapturableComponent,
  propName,
  eventType = 'touch'
) => {
  class HeapAutocapture extends React.Component {
    trackEvent() {
      const autotrackProps = getBaseComponentProps(this);

      if (!autotrackProps) {
        // We're not capturing this interaction.
        return;
      }

      track(eventType, autotrackProps);
    }

    render() {
      const {
        heapForwardedRef,
        [propName]: defaultImplementation,
        ...rest
      } = this.props;

      const instrumentedProps = {
        [propName]: e => {
          bailOnError(() => this.trackEvent())();
          defaultImplementation && defaultImplementation(e);
        },
      };

      return (
        <CapturableComponent
          ref={heapForwardedRef}
          {...instrumentedProps}
          {...rest}
        >
          {this.props.children}
        </CapturableComponent>
      );
    }
  }

  HeapAutocapture.displayName = `withHeapAutocapture(${getComponentDisplayName(
    CapturableComponent
  )})`;

  const forwardRefHoc = React.forwardRef((props, ref) => {
    return <HeapAutocapture {...props} heapForwardedRef={ref} />;
  });

  hoistNonReactStatic(forwardRefHoc, CapturableComponent);

  return forwardRefHoc;
};
