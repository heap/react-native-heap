import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import BasicsPage from './pages/basics';
import PropExtraction from './pages/propExtraction';

import Heap from '@heap/react-native-heap';

Heap.setAppId('2084764307');
console.log('Heap App ID set');

const TabNavigator = createBottomTabNavigator({
  Basics: BasicsPage,
  PropExtraction: PropExtraction,
});

export default createAppContainer(TabNavigator);
