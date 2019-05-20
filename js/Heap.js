// Libraries
import React from 'react';
import { NativeModules } from 'react-native';

import {
  HeapIgnore,
  HeapIgnoreTargetText,
  withHeapIgnore,
} from './autotrack/heapIgnore';
import { autotrackPress } from './autotrack/touchables';
import { autotrackSwitchChange } from './autotrack/switches';
import { checkDisplayNamePlugin } from './util/checkDisplayNames';
import { withReactNavigationAutotrack } from './autotrack/reactNavigation';
import { bailOnError } from './util/bailer';

const flatten = require('flat');
const RNHeap = NativeModules.RNHeap;

const track = bailOnError((event, payload) => {
  try {
    // This looks a little strange, but helps for testing, to be able to mock the flatten function and
    // simulate a failure.
    const flatten = require('flat');

    payload = payload || {};
    RNHeap.track(event, flatten(payload));

    checkDisplayNamePlugin();
  } catch (e) {
    console.log('Error calling Heap.track\n', e);
  }
});

export { HeapIgnore, HeapIgnoreTargetText };

export default {
  // App Properties
  setAppId: bailOnError(appId => RNHeap.setAppId(appId)),

  // User Properties
  identify: bailOnError(identity => RNHeap.identify(identity)),
  addUserProperties: bailOnError(properties => {
    RNHeap.addUserProperties(flatten(properties));
  }),

  // Event Properties
  addEventProperties: bailOnError(properties => {
    RNHeap.addEventProperties(flatten(properties));
  }),
  removeEventProperty: bailOnError(property =>
    RNHeap.removeEventProperty(property)
  ),
  clearEventProperties: bailOnError(() => RNHeap.clearEventProperties()),

  // Events
  track: track,

  // Redux middleware
  reduxMiddleware: store => next =>
    bailOnError(action => {
      RNHeap.track('Redux Action', flatten(action));
      next(action);
    }),

  autotrackPress: bailOnError(autotrackPress(track)),
  autotrackSwitchChange: bailOnError(autotrackSwitchChange(track)),
  withReactNavigationAutotrack: withReactNavigationAutotrack(track),
  Ignore: HeapIgnore,
  IgnoreTargetText: HeapIgnoreTargetText,
  withHeapIgnore,
};
