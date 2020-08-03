/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Heap from '@heap/react-native-heap';

import { HomeScreen } from './src/screens/HomeScreen';
import { NavigationStackScreen } from './src/screens/NavigationScreen';
import { TouchablesScreen } from './src/screens/TouchablesScreen';

const Stack = createStackNavigator();

const HeapNavigationContainer = Heap.withReactNavigationAutotrack(
  NavigationContainer
);

const App: () => React$Node = () => {
  return (
    <HeapNavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Navigation"
          component={NavigationStackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Touchables" component={TouchablesScreen} />
      </Stack.Navigator>
    </HeapNavigationContainer>
  );
};

export default App;
