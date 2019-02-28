import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import TouchablesPage from './pages/touchables';

import Heap from '@heap/react-native-heap';

Heap.setAppId('2084764307');
console.log('Heap App ID set');

const TabNavigator = createBottomTabNavigator({
  Touchables: TouchablesPage,
});

export default createAppContainer(TabNavigator);
