import React from 'react';
import { Provider } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { store } from './src/reduxElements';
import TopNavigator from './src/topNavigator';
import NavigationService from './src/navigatorService';

export default class App extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      console.log('Forcing update of react nav HOC via setState().');
      this.setState({});
    }, 3000);
  }
  render() {
    return (
      <Provider store={store}>
        <TopNavigator
          ref={NavigationService.setTopLevelNavigator}
          onNavigationStateChange={() => {}} // Checks that manually instrumenting screen tracking works.
        />
      </Provider>
    );
  }
}
