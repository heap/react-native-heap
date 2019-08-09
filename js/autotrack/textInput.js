import { getBaseComponentProps } from './common';
import * as _ from 'lodash';

export const autocaptureTextInputChange = track => (
  eventType,
  componentThis,
  event
) => {
  // Attach a debounce function to the TextInput component instance if one's not already attached.
  if (!componentThis.__heap__debounceTextChange) {
    componentThis.__heap__debounceTextChange = _.debounce(
      debouncedAutocaptureTextInputChange(track),
      1000
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
    autotrackProps.placeholderText = componentThis.props.placeholder;
  }

  track(eventType, autotrackProps);
};
