import React from 'react';
import { Button, ScrollView, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { StackNavigationScreen } from './navigationScreens/StackNavigationScreen';
import { TabNavigationScreen } from './navigationScreens/TabNavigationScreen';

const NavigationScreen = ({ navigation }) => {
  return (
    <ScrollView>
      <Button
        title="Navigation - Tabs"
        onPress={() => navigation.push('TabNavigation')}
      />
      <Button
        title="Navigation - Stack"
        onPress={() => navigation.push('StackNavigation')}
      />
      <Button
        title="Navigation - Drawer"
        onPress={() => navigation.push('DrawerNavigation')}
      />
    </ScrollView>
  );
};

const DrawerNavigationScreen = ({ navigation }) => {
  return (<Text>TODO</Text>);
};

const NavigationStack = createStackNavigator();

export const NavigationStackScreen = () => {
  return (
    <NavigationStack.Navigator>
      <NavigationStack.Screen
        name="NavigationHome"
        component={NavigationScreen}
      />
      <NavigationStack.Screen
        name="TabNavigation"
        component={TabNavigationScreen}
      />
      <NavigationStack.Screen
        name="StackNavigation"
        component={StackNavigationScreen}
      />
      <NavigationStack.Screen
        name="DrawerNavigation"
        component={DrawerNavigationScreen}
      />
    </NavigationStack.Navigator>
  );
};
