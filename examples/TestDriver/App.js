import React from 'react';
import { Provider } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { store } from './src/reduxElements';
import TopNavigator from './src/topNavigator';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;

  navigate('Initial');
}

function navigate(routeName, params) {
  console.log(_navigator);
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <TopNavigator ref={setTopLevelNavigator} />
      </Provider>
    );
  }
}
