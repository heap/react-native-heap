import React from 'react';
import { Button, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const HomeStackScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Stack"
        onPress={() => navigation.push('Stack')}
      />
      <Button
        title="Modal"
        onPress={() => navigation.navigate('Modal')}
      />
    </View>
  );
};

const StackScreen = ({navigation}) => {
  return (
    <Button title="Pop1" onPress={() => navigation.pop()}/>
  );
};

const ModalScreen = ({navigation}) => {
  return (
    <Button title="Dismiss Modal" onPress={() => navigation.goBack()} />
  );
};

const NavigationStack = createStackNavigator();
const RootNavigationStack = createStackNavigator();

const NestedStackNavigationScreen = () => {
  return (
    <NavigationStack.Navigator>
      <NavigationStack.Screen
        name="Home"
        component={HomeStackScreen}
      />
      <NavigationStack.Screen
        name="Stack"
        component={StackScreen}
      />
    </NavigationStack.Navigator>
  );
};

export const StackNavigationScreen = () => {
  return (
    <RootNavigationStack.Navigator mode="modal">
      <NavigationStack.Screen
        name="Main"
        component={NestedStackNavigationScreen}
        options={{ headerShown: false }}
      />
      <NavigationStack.Screen
        name="Modal"
        component={ModalScreen}
      />
    </RootNavigationStack.Navigator>
  )
}
