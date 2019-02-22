// Libraries
import React from 'react';
import { NativeModules, Platform } from 'react-native';

import { extractProps } from './util/extractProps';
import { builtinPropExtractorConfig } from './propExtractorConfig';

let flatten = require('flat');

const RNHeap = NativeModules.RNHeap;

const track = (event, payload) => {
  RNHeap.track(event, flatten(payload));
};

getActiveRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return `${route.routeName}::${getActiveRouteName(route)}`;
  }

  return route.routeName;
}

let navRef = null;
const NavigationService = {
  setTopLevelNavigator: (ref) => {
    navRef = ref;
  }
}

const withHeapNavigationAutotrack = (AppContainer) => {
  return class extends React.Component {
    componentDidMount() {
      const initialPageviewPath = getActiveRouteName(navRef.state.nav);
      track('screenview', {
        path: initialPageviewPath,
      });
    }

    render() {
      return (
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          onNavigationStateChange={(prev, next, action) => {
            const prevScreenRoute = getActiveRouteName(prev);
            const nextScreenRoute = getActiveRouteName(next);
            if (prevScreenRoute !== nextScreenRoute) {
              const currentScreen = getActiveRouteName(next);
              track('screenview', {
                path: currentScreen,
                type: action.type,
              });
            }
          }}
        >
          {this.props.children}
        </AppContainer>
      );
    }
  };
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

  withHeapNavigationAutotrack,
};

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
    currNode.type === 'RCTView' ||
    currNode.type === null ||
    !(currNode.type.displayName || currNode.type.name)
  ) {
    return getFiberNodeComponentHierarchy(currNode.return);
  }

  const elementName =
    currNode.type.displayName || currNode.type.name;

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
