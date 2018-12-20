// Libraries
import { NativeModules, Platform } from 'react-native';
import Package from 'react-native-package';

let flatten = require('flat');

/**
 * Package.create handles two things:
 *
 *   1. Checks that for each platform that's `enabled`, the module is installed
 *      properly. If it's not, it logs a warning.
 *   2. Guards the module on every platform that is not `enabled`. This allows
 *      the module to exist in cross-platform code without hacks to disable it.
 *
 * You can read more about `react-native-package` here:
 * https://github.com/negativetwelve/react-native-package
 */
export default Package.create({
  json: require('../package.json'),
  nativeModule: NativeModules.RNHeap,
  enabled: Platform.select({
    ios: true,
    android: true,
  }),
  export: Heap => ({
    // App Properties
    setAppId: appId => Heap.setAppId(appId),

    // User Properties
    identify: identity => Heap.identify(identity),
    addUserProperties: properties =>
      Heap.addUserProperties(flatten(properties)),

    // Event Properties
    addEventProperties: properties =>
      Heap.addEventProperties(flatten(properties)),
    removeEventProperty: property => Heap.removeEventProperty(property),
    clearEventProperties: () => Heap.clearEventProperties(),

    // Events
    track: (event, payload) => Heap.track(event, flatten(payload)),

    // Redux middleware
    reduxMiddleware: store => next => action => {
      Heap.track('Redux Action', flatten(action));
      next(action);
    },
  }),
});
