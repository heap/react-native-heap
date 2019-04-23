import React from 'react';
import { bail, bailOnError } from '../util/bailer';

const EVENT_TYPE = 'reactNavigationScreenview';

// `react-native-navigation` uses `Navigation/{NAVIGATE,POP,BACK}` to represent
// different types of navigation actions. We build the initial navigation action
// ourselves, so we invent a fourth navigation type to represent this action.
const INITIAL_ROUTE_TYPE = 'Heap_Navigation/INITIAL';

export const withReactNavigationAutotrack = track => AppContainer => {
  return class HeapNavigationWrapper extends React.Component {
    topLevelNavigator = null;

    trackInitialRoute() {
      const initialPageviewPath = getActiveRouteName(
        this.topLevelNavigator.state.nav
      );

      track(EVENT_TYPE, {
        path: initialPageviewPath,
        type: INITIAL_ROUTE_TYPE,
      });
    }

    render() {
      try {
        return this._render();
      } catch(e) {
        bail(e);
        return (
          <AppContainer/>
        );
      }
    }

    _render() {
      return (
        <AppContainer
          ref={bailOnError(navigatorRef => {
            if (this.topLevelNavigator !== navigatorRef) {
              console.log(
                'Heap: React Navigation is instrumented for autocapture.'
              );
              this.topLevelNavigator = navigatorRef;
              this.trackInitialRoute();
            }
          })}
          onNavigationStateChange={bailOnError((prev, next, action) => {
            const prevScreenRoute = getActiveRouteName(prev);
            const nextScreenRoute = getActiveRouteName(next);
            if (prevScreenRoute !== nextScreenRoute) {
              const currentScreen = getActiveRouteName(next);
              track(EVENT_TYPE, {
                path: currentScreen,
                type: action.type,
              });
            }
          })}
        >
          {this.props.children}
        </AppContainer>
      );
    }
  };
};

const getActiveRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return `${route.routeName}::${getActiveRouteName(route)}`;
  }

  return route.routeName;
};
