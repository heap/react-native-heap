import React from "react";
import { Provider } from "react-redux";
import { View,Text,Button, StyleSheet } from "react-native";
import Heap from '@heap/react-native-heap';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator, createAppContainer } from "react-navigation";

import { store } from "./src/reduxElements";
import MainScreen from "./src/mainScreen";

class OtherScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={() => {console.log('yolo'); this.props.navigation.navigate('MyModal')}} title={'press me'}/>
      </View>
    );
  }
}

const StackNav = createStackNavigator({
  Original: {
    screen: MainScreen,
  },
  Other: {
    screen: OtherScreen,
  }
});

const AppNavigator = createBottomTabNavigator({
// const AppNavigator = createDrawerNavigator({
  Main: {
    screen: StackNav,
  },
  AppOther: {
    screen: OtherScreen,
  }
});

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => {this.props.navigation.goBack(); console.log(AppNavigator)}}
          title="Dismiss"
        />
      </View>
    );
  }
}

const TopNavigator = createStackNavigator(
  {
    Main: {
      screen: AppNavigator,
    },
    MyModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const AppContainer = Heap.withHeapNavigationAutotrack(createAppContainer(TopNavigator));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer/>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
