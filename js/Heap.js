// Libraries
import React from 'react';
import { NativeModules } from 'react-native';

import {
  HeapIgnore,
  HeapIgnoreTargetText,
  withHeapIgnore,
} from './autotrack/heapIgnore';
import {
  autotrackPress,
  withHeapTouchableAutocapture,
} from './autotrack/touchables';
import { withHeapPressableAutocapture } from './autotrack/pressable';
import { autotrackSwitchChange, withHeapSwitchAutocapture } from './autotrack/switches';
import { autotrackScrollView } from './autotrack/scrollViews';
import {
  autocaptureTextInputChange,
  withHeapTextInputAutocapture,
} from './autotrack/textInput';
import { checkDisplayNamePlugin } from './util/checkDisplayNames';
import { withReactNavigationAutotrack } from './autotrack/reactNavigation';
import { bailOnError } from './util/bailer';
import { getContextualProps } from './util/contextualProps';

const flatten = require('flat');
const RNHeap = NativeModules.RNHeap;

const autocaptureTrack = bailOnError((event, payload) => {
  try {
    RNHeap.autocaptureEvent(event, payload);

    checkDisplayNamePlugin();
  } catch (e) {
    console.log('Error autocapturing Heap event.\n', e);
  }
});

const manualTrack = bailOnError((event, payload) => {
  try {
    // This looks a little strange, but helps for testing, to be able to mock the flatten function and
    // simulate a failure.
    const flatten = require('flat');

    const contextualProps = getContextualProps();

    payload = payload || {};
    RNHeap.manuallyTrackEvent(event, flatten(payload), contextualProps);
  } catch (e) {
    console.log('Error calling Heap.track\n', e);
  }
});

export { HeapIgnore, HeapIgnoreTargetText };

export default {
  // App Properties
  setAppId: bailOnError(appId => RNHeap.setAppId(appId)),

  // User Properties
  // Returns a promise that resolves to the Heap user ID.
  getUserId: bailOnError(() => RNHeap.getUserId()),
  getSessionId: bailOnError(() => RNHeap.getSessionId()),
  identify: bailOnError(identity => RNHeap.identify(identity)),
  resetIdentity: bailOnError(() => RNHeap.resetIdentity()),
  addUserProperties: bailOnError(properties => {
    const payload = properties || {};
    RNHeap.addUserProperties(flatten(payload));
  }),

  // Event Properties
  addEventProperties: bailOnError(properties => {
    const payload = properties || {};
    RNHeap.addEventProperties(flatten(payload));
  }),
  removeEventProperty: bailOnError(property =>
    RNHeap.removeEventProperty(property)
  ),
  clearEventProperties: bailOnError(() => RNHeap.clearEventProperties()),

  // Events
  track: manualTrack,

  // Redux middleware
  reduxMiddleware: store => next =>
    bailOnError(action => {
      RNHeap.manualTrack('Redux Action', flatten(action));
      next(action);
    }),

  autotrackPress: bailOnError(autotrackPress(autocaptureTrack)),
  withHeapTouchableAutocapture: withHeapTouchableAutocapture(autocaptureTrack),
  withHeapPressableAutocapture: withHeapPressableAutocapture(autocaptureTrack),
  withHeapSwitchAutocapture: withHeapSwitchAutocapture(autocaptureTrack),
  autotrackSwitchChange: bailOnError(autotrackSwitchChange(autocaptureTrack)),
  autocaptureScrollView: bailOnError(autotrackScrollView(autocaptureTrack)),
  autocaptureTextInput: bailOnError(
    autocaptureTextInputChange(autocaptureTrack)
  ),
  withHeapTextInputAutocapture: withHeapTextInputAutocapture(autocaptureTrack),
  withReactNavigationAutotrack: withReactNavigationAutotrack(autocaptureTrack),
  Ignore: HeapIgnore,
  IgnoreTargetText: HeapIgnoreTargetText,
  withHeapIgnore,
};
