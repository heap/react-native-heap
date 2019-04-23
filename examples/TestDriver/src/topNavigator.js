import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import InitialPage from './pages/initial';
import BasicsPage from './pages/basics';
import PropExtraction from './pages/propExtraction';
import NavPage from './pages/nav';

import Heap from '@heap/react-native-heap';

const TabNavigator = createBottomTabNavigator({
  Initial: {
    screen: InitialPage,
  },
  Basics: {
    screen: BasicsPage,
    navigationOptions: () => {
      return {
        title: 'Basics',
        tabBarLabel: 'Basics',
        tabBarAccessibilityLabel: 'Basics',
        tabBarTestID: 'Basics',
      };
    },
  },
  PropExtraction: {
    screen: PropExtraction,
    navigationOptions: () => {
      return {
        title: 'PropExtraction',
        tabBarLabel: 'PropExtraction',
        tabBarAccessibilityLabel: 'PropExtraction',
        tabBarTestID: 'PropExtraction',
      };
    },
  },
  Nav: {
    screen: NavPage,
    navigationOptions: () => {
      return {
        title: 'Nav',
        tabBarLabel: 'Nav',
        tabBarAccessibilityLabel: 'Nav',
        tabBarTestID: 'Nav',
      };
    },
  },
});

export default Heap.withReactNavigationAutotrack(
  createAppContainer(TabNavigator)
);
