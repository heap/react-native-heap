import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab1 = () => {
  return <Text>Tab1</Text>
};

const Tab2 = () => {
  return <Text>Tab2</Text>
};

const Tab3 = () => {
  return <Text>Tab3</Text>
};

const Tab = createBottomTabNavigator();

export const TabNavigationScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Tab1"
        component={Tab1}
      />
      <Tab.Screen
        name="Tab2"
        component={Tab2}
      />
      <Tab.Screen
        name="Tab3"
        component={Tab3}
      />
    </Tab.Navigator>
  );
};
