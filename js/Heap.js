// Libraries
import React from 'react';
import { NativeModules } from 'react-native';

import { autotrackPress } from './autotrack/touchables';
import { autotrackSwitchChange } from './autotrack/switches';
import { checkDisplayNamePlugin } from './util/checkDisplayNames';
import { withReactNavigationAutotrack } from './autotrack/reactNavigation';

const flatten = require('flat');
const RNHeap = NativeModules.RNHeap;

const track = (event, payload) => {
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
  autotrackSwitchChange: autotrackSwitchChange(track),
  withReactNavigationAutotrack: withReactNavigationAutotrack(track),
};
