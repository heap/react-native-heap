import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import * as _ from 'lodash';

import { getBaseComponentProps } from './common';
import { bailOnError } from '../util/bailer';
import { getComponentDisplayName } from '../util/hocUtil';

const DEBOUNCE_PERIOD_MS = 1000;

export const autocaptureTextInputChange = track => (
  eventType,
  componentThis,
  event
) => {
  // Attach a debounce function to the TextInput component instance if one's not already attached.
  if (!componentThis.__heap__debounceTextChange) {
    componentThis.__heap__debounceTextChange = _.debounce(
      debouncedAutocaptureTextInputChange(track),
      DEBOUNCE_PERIOD_MS
    );
  }

  componentThis.__heap__debounceTextChange(eventType, componentThis, event);
};

const debouncedAutocaptureTextInputChange = track => (
  eventType,
  componentThis,
  event
) => {
  const autotrackProps = getBaseComponentProps(componentThis);

  if (!autotrackProps) {
    // We're not capturing this interaction.
    return;
  }

  if (componentThis.props.placeholder) {
    autotrackProps.placeholder_text = componentThis.props.placeholder;
  }

  track(eventType, autotrackProps);
};

// :HACK: In previous implementations, there would be a 'TextInput' component somewhere in the hierarchy.  However, with this
// implementation, this is not the case (even the TextInputComponent has a displayName of 'InternalTextInput').  This means that any event
// definitions on 'TextInput' would break.
// To get around this, wrap the returned HOC with a no-op component with the 'TextInput' display name.
// :TODO: (jmtaber129): Consider other workarounds to this, like setting the display name of instrumented components when they're exported
// from the React Native lib (via instrumentation).
const NoopTextInput = props => {
  return props.children;
};

NoopTextInput.displayName = 'TextInput';

export const withHeapTextInputAutocapture = track => TextInputComponent => {
  class HeapTextInputAutocapture extends React.Component {
    autocaptureTextInputChangeWithDebounce = bailOnError(
      _.debounce(debouncedAutocaptureTextInputChange(track), DEBOUNCE_PERIOD_MS)
    );

    render() {
      const { heapForwardedRef, onChange, ...rest } = this.props;

      return (
        <TextInputComponent
          ref={heapForwardedRef}
          onChange={e => {
            this.autocaptureTextInputChangeWithDebounce('text_edit', this, e);

            onChange && onChange(e);
          }}
          {...rest}
        >
          {this.props.children}
        </TextInputComponent>
      );
    }
  }

  HeapTextInputAutocapture.displayName = `WithHeapTextInputAutocapture(${getComponentDisplayName(
    TextInputComponent
  )})`;

  const forwardRefHoc = React.forwardRef((props, ref) => {
    return (
      <NoopTextInput {...props}>
        <HeapTextInputAutocapture {...props} heapForwardedRef={ref} />
      </NoopTextInput>
    );
  });

  hoistNonReactStatic(forwardRefHoc, TextInputComponent);

  return forwardRefHoc;
};
