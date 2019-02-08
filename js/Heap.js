// Libraries
import { NativeModules, Platform } from 'react-native';
import Package from 'react-native-package';

import { extractProps } from './util/extractProps';
import { builtinPropExtractorConfig } from './propExtractorConfig';

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
        const touchableHierarchy = getComponentHierarchy(componentThis);
        const touchState =
          componentThis &&
          componentThis.state &&
          componentThis.state.touchable &&
          componentThis.state.touchable.touchState;

        const targetText = getTargetText(componentThis._reactInternalFiber);

        const autotrackProps = {
          touchableHierarchy,
          touchState,
        };

        if (targetText !== '') {
          autotrackProps.targetText = targetText;
        }

        track(eventType, autotrackProps);
      },
    };
  },
});

// :TODO: (jmtaber129): Consider implementing sibling target text.
const getTargetText = fiberNode => {
  if (fiberNode.elementType === 'RCTText') {
    return fiberNode.memoizedProps.children;
  }

  if (fiberNode.child === null) {
    return '';
  }

  const children = [];
  let currChild = fiberNode.child;
  while (currChild) {
    children.push(currChild);
    currChild = currChild.sibling;
  }

  let targetText = '';
  children.forEach(child => {
    targetText = (targetText + ' ' + getTargetText(child)).trim();
  });
  return targetText;
}

const getComponentHierarchy = componentThis => {
  // :TODO: (jmtaber129): Remove this if/when we support pre-fiber React.
  if (!componentThis._reactInternalFiber) {
    throw new Error(
      'Pre-fiber React versions (React 16) are currently not supported by Heap autotrack.'
    );
  }

  return getFiberNodeComponentHierarchy(componentThis._reactInternalFiber);
};

const getFiberNodeComponentHierarchy = currNode => {
  if (currNode === null) {
    return '';
  }

  // Skip components we don't care about.
  // :TODO: (jmtaber129): Skip components with names/display names like 'View' and '_class'.
  if (
    currNode.elementType === 'RCTView' ||
    currNode.elementType === null ||
    !(currNode.elementType.displayName || currNode.elementType.name)
  ) {
    return getFiberNodeComponentHierarchy(currNode.return);
  }

  const elementName =
    currNode.elementType.displayName || currNode.elementType.name;

  // In dev builds, 'View' components remain in the fiber tree, but don't provide any useful
  // information, so exclude these from the hierarchy.
  if (elementName === 'View') {
    return getFiberNodeComponentHierarchy(currNode.return);
  }

  const propsString = extractProps(
    elementName,
    currNode.stateNode,
    builtinPropExtractorConfig
  );

  return `${getFiberNodeComponentHierarchy(
    currNode.return
  )}${elementName};${propsString}|`;
};
