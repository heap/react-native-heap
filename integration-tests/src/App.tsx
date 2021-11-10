/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Heap from '@heap/react-native-heap';

import {HomeScreen} from './screens/HomeScreen';
import {NavigationStackScreen} from './screens/NavigationScreen';
import {TouchablesScreen} from './screens/TouchablesScreen';
import {PropertiesScreen} from './screens/PropertiesScreen';
import {HeapIgnoreScreen} from './screens/HeapIgnoreScreen';

const Stack = createStackNavigator();

const HeapNavigationContainer =
  Heap.withReactNavigationAutotrack(NavigationContainer);

const App: () => React.ReactNode = () => {
  return (
    <HeapNavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Navigation"
          component={NavigationStackScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Touchables" component={TouchablesScreen} />
        <Stack.Screen name="Properties" component={PropertiesScreen} />
        <Stack.Screen name="HeapIgnore" component={HeapIgnoreScreen} />
      </Stack.Navigator>
    </HeapNavigationContainer>
  );
};

export default App;
