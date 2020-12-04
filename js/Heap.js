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
import { autotrackSwitchChange } from './autotrack/switches';
import { autotrackScrollView } from './autotrack/scrollViews';
import {
  autocaptureTextInputChange,
  withHeapTextInputAutocapture,
} from './autotrack/textInput';
import { checkDisplayNamePlugin } from './util/checkDisplayNames';
import { withReactNavigationAutotrack } from './autotrack/reactNavigation';
import { bailOnError } from './util/bailer';

const flatten = require('flat');
const RNAnalytics = NativeModules.RNAnalytics;

const autocaptureTrack = bailOnError((event, payload) => {
  try {
    RNAnalytics.track(event, payload, {}, {});

    checkDisplayNamePlugin();
  } catch (e) {
    console.log('Error autocapturing Heap event.\n', e);
  }
});

export { HeapIgnore, HeapIgnoreTargetText };

export default {
  autotrackPress: bailOnError(autotrackPress(autocaptureTrack)),
  withHeapTouchableAutocapture: withHeapTouchableAutocapture(autocaptureTrack),
  withHeapPressableAutocapture: withHeapPressableAutocapture(autocaptureTrack),
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
