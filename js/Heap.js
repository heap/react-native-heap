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
import { swallowErrors } from './util/bailer';
import { getContextualProps } from './util/contextualProps';

const flatten = require('flat');
const RNHeap = NativeModules.RNHeap;

if (!RNHeap) {
  console.warn('Heap: The RNHeap native module is not installed. Events will not be captured.');
}

const autocaptureTrack = swallowErrors((event, payload) => {
  RNHeap?.autocaptureEvent(event, payload);
  checkDisplayNamePlugin();
}, 'Event autocapture', true);

const manualTrack = (event, payload) => {
    // This looks a little strange, but helps for testing, to be able to mock the flatten function and
    // simulate a failure.
    const flatten = require('flat');

    const contextualProps = getContextualProps();

    payload = payload || {};
    RNHeap?.manuallyTrackEvent(event, flatten(payload), contextualProps);
};

export { HeapIgnore, HeapIgnoreTargetText };

export default {
  // App Properties
  setAppId: swallowErrors(appId => RNHeap?.setAppId(appId), 'Heap.setAppId'),

  // User Properties
  // Returns a promise that resolves to the Heap user ID.
  getUserId: swallowErrors(
    () => RNHeap?.getUserId(),
    'Heap.getUserId'
  ),

  getSessionId: swallowErrors(
    () => RNHeap?.getSessionId(),
    'Heap.getSessionId'
  ),

  identify: swallowErrors(
    identity => RNHeap?.identify(identity),
    'Heap.identify'
  ),

  resetIdentity: swallowErrors(
    () => RNHeap?.resetIdentity(),
    'Heap.resetIdentity'
  ),

  addUserProperties: swallowErrors(
    properties => RNHeap?.addUserProperties(flatten(properties || {})),
    'Heap.addUserProperties'
  ),

  // Event Properties
  addEventProperties: swallowErrors(
    properties => RNHeap?.addEventProperties(flatten(properties || {})),
    'Heap.addEventProperties'
  ),

  removeEventProperty: swallowErrors(
    property => RNHeap?.removeEventProperty(property),
    'Heap.removeEventProperty'
  ),

  clearEventProperties: swallowErrors(
    () => RNHeap?.clearEventProperties(),
    'Heap.clearEventProperties'
  ),

  // Events
  track: swallowErrors(
    manualTrack,
    'Heap.track',
    true
  ),

  // Redux middleware
  reduxMiddleware: store => next =>
    swallowErrors(action => {
      RNHeap?.manualTrack('Redux Action', flatten(action));
      next(action);
    }, 'Heap.reduxMiddleware'),

  autotrackPress: swallowErrors(
    autotrackPress(autocaptureTrack),
    'Heap.autotrackPress'
  ),

  withHeapTouchableAutocapture: withHeapTouchableAutocapture(autocaptureTrack),
  withHeapPressableAutocapture: withHeapPressableAutocapture(autocaptureTrack),
  withHeapSwitchAutocapture: withHeapSwitchAutocapture(autocaptureTrack),

  autotrackSwitchChange: swallowErrors(
    autotrackSwitchChange(autocaptureTrack),
    'Heap.autotrackSwitchChange'
  ),

  autocaptureScrollView: swallowErrors(
    autotrackScrollView(autocaptureTrack),
    'Heap.autocaptureScrollView'
  ),

  autocaptureTextInput: swallowErrors(
    autocaptureTextInputChange(autocaptureTrack),
    'Heap.autocaptureTextInput'
  ),

  withHeapTextInputAutocapture: withHeapTextInputAutocapture(autocaptureTrack),
  withReactNavigationAutotrack: withReactNavigationAutotrack(autocaptureTrack),
  Ignore: HeapIgnore,
  IgnoreTargetText: HeapIgnoreTargetText,
  withHeapIgnore,
};
