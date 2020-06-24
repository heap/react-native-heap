import { getBaseComponentPropsFromComponent } from './common';
import * as _ from 'lodash';

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
  const autotrackProps = getBaseComponentPropsFromComponent(componentThis);

  if (!autotrackProps) {
    // We're not capturing this interaction.
    return;
  }

  if (componentThis.props.placeholder) {
    autotrackProps.placeholder_text = componentThis.props.placeholder;
  }

  track(eventType, autotrackProps);
};
