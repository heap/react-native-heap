import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/reduxElements";
import MainScreen from "./src/mainScreen";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainScreen />
      </Provider>
    );
  }
}
