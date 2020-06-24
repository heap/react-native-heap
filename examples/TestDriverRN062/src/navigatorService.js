// Used for testing compatibility with the "Navigation without navigation prop" pattern in React
// Navigation. See https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html.

import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

export default {
  navigate,
  setTopLevelNavigator,
};
