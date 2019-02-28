import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/reduxElements';
import TopNavigator from './src/topNavigator';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <TopNavigator />
      </Provider>
    );
  }
}
