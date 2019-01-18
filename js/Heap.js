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
  export: Heap => {
    const track = (event, payload) => {
      Heap.track(event, flatten(payload));
    };

    return {
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
      track: track,

      // Redux middleware
      reduxMiddleware: store => next => action => {
        Heap.track('Redux Action', flatten(action));
        next(action);
      },

      autotrackPress: (eventType, componentThis, event) => {
        const touchableHierarchy = getComponentHierarchy(componentThis._reactInternalFiber);
        const touchState = componentThis.state.touchable.touchState;

        const eventObj = {
          touchableHierarchy,
          touchState,
        }

        track(eventType, eventObj);
      },
    };
  },
});

const getComponentHierarchy = (currNode) => {
  if (currNode === null) {
    return '';
  }

  // Skip components we don't care about.
  // :TODO: (jmtaber129): Skip components with names/display names like 'View' and '_class'.
  if (!(currNode.elementType !== 'RCTView' && currNode.elementType !== null && (currNode.elementType.displayName || currNode.elementType.name))) {
    return `${getComponentHierarchy(currNode.return)}`;
  }

  const elementName = currNode.elementType.displayName || currNode.elementType.name || null;

  // If the element is a button, capture its props.
  // :TODO: (jmtaber129): Change this once we allow configurably captured props.
  let propsString = '';
  if (elementName === 'Button') {
    const props = currNode.stateNode.props;
    const keys = Object.keys(props);
    keys.forEach((key) => {
      if (Object(props[key]) !== props[key]) {
        propsString += `[${key}=${props[key]}];`;
      }
    });
  }

  return `${getComponentHierarchy(currNode.return)}${elementName};${propsString}|`;
};
