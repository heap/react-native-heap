// Libraries
import React from 'react';
import { NativeModules } from 'react-native';

import { autotrackPress } from './autotrack/touchables';
import { withReactNavigationAutotrack } from './autotrack/reactNavigation';

const RNHeap = NativeModules.RNHeap;

const track = (event, payload) => {
  try {
    let flatten = require('flat');
    payload = payload || {};
    RNHeap.track(event, flatten(payload));
  } catch (e) {
    console.log('Error calling Heap.track\n', e);
  }
};

export default {
  // App Properties
  setAppId: appId => RNHeap.setAppId(appId),

  // User Properties
  identify: identity => RNHeap.identify(identity),
  addUserProperties: properties =>
    RNHeap.addUserProperties(flatten(properties)),

  // Event Properties
  addEventProperties: properties =>
    RNHeap.addEventProperties(flatten(properties)),
  removeEventProperty: property => RNHeap.removeEventProperty(property),
  clearEventProperties: () => RNHeap.clearEventProperties(),

  // Events
  track: track,

  // Redux middleware
  reduxMiddleware: store => next => action => {
    RNHeap.track('Redux Action', flatten(action));
    next(action);
  },

  autotrackPress: autotrackPress(track),
  withReactNavigationAutotrack: withReactNavigationAutotrack(track),
};
