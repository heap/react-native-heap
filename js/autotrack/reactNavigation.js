import React from 'react';
import { bail, bailOnError } from '../util/bailer';
import { getComponentDisplayName } from '../util/hocUtil';
import NavigationUtil from '../util/navigationUtil';

const EVENT_TYPE = 'react_navigation_screenview';

// `react-native-navigation` uses `Navigation/{NAVIGATE,POP,BACK}` to represent
// different types of navigation actions. We build the initial navigation action
// ourselves, so we invent a fourth navigation type to represent this action.
const INITIAL_ROUTE_TYPE = 'Heap_Navigation/INITIAL';

export const withReactNavigationAutotrack = track => AppContainer => {
  const captureNavigationStateChange = bailOnError((prev, next, action) => {
    const { screen_path: prevScreenRoute } = NavigationUtil.getActiveRouteProps(
      prev
    );
    const { screen_path: nextScreenRoute } = NavigationUtil.getActiveRouteProps(
      next
    );
    if (prevScreenRoute !== nextScreenRoute) {
      track(EVENT_TYPE, {
        screen_path: nextScreenRoute,
        action: action.type,
      });
    }
  });

  class HeapNavigationWrapper extends React.Component {
    topLevelNavigator = null;

    setRef(ref, value) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        ref.current = value;
      }
    }

    trackInitialRoute() {
      const {
        screen_path: initialPageviewPath,
      } = NavigationUtil.getActiveRouteProps(this.topLevelNavigator.state.nav);

      track(EVENT_TYPE, {
        screen_path: initialPageviewPath,
        action: INITIAL_ROUTE_TYPE,
      });
    }

    render() {
      try {
        return this._render();
      } catch (e) {
        bail(e);
        const { forwardedRef, ...rest } = this.props;
        return <AppContainer ref={forwardedRef} {...rest} />;
      }
    }

    _render() {
      const { forwardedRef, onNavigationStateChange, ...rest } = this.props;
      return (
        <AppContainer
          ref={bailOnError(navigatorRef => {
            this.setRef(forwardedRef, navigatorRef);
            // Update the NavigationUtil's nav reference to the updated ref.
            NavigationUtil.setNavigationRef(navigatorRef);
            // Only update the 'topLevelNavigator' if the new nav ref is different and non-null.
            if (
              this.topLevelNavigator !== navigatorRef &&
              navigatorRef !== null
            ) {
              console.log(
                'Heap: React Navigation is instrumented for autocapture.'
              );
              this.topLevelNavigator = navigatorRef;
              this.trackInitialRoute();
            }
          })}
          onNavigationStateChange={(...args) => {
            // Capture the screenview, then delegate to the 'onNavigationStateChange' passed to the HOC if it's a function. The logic to
            // determine whether to call 'onNavigationStateChange' is the same as what's in the 'react-navigation' library.
            // See https://github.com/react-navigation/native/blob/d0b24924b2e075fed3bd6586339d34fdd4c2b78e/src/createAppContainer.js#L184
            captureNavigationStateChange(...args);
            if (typeof onNavigationStateChange === 'function') {
              onNavigationStateChange(...args);
            }
          }}
          {...rest}
        >
          {this.props.children}
        </AppContainer>
      );
    }
  }

  HeapNavigationWrapper.displayName = `withReactNavigationAutotrack(${getComponentDisplayName(
    AppContainer
  )})`;

  return React.forwardRef((props, ref) => {
    return <HeapNavigationWrapper {...props} forwardedRef={ref} />;
  });
};
