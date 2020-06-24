import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { makeSentinelButton } from '../sentinelUtilities';
import NavigationService from '../navigatorService';

const BaseView = props => {
  return (
    <View style={styles.container}>
      <Button
        title="Navigate Stack"
        testID="navigate_stack"
        onPress={() => props.navigation.navigate('StackCard')}
      />
      <Button
        title="Navigate Modal"
        testID="navigate_modal"
        onPress={() => props.navigation.navigate('ModalStack')}
      />
      <Button
        title="Navigate without prop"
        testID="navigate_without_prop"
        onPress={() => NavigationService.navigate('Nav')}
      />
      {makeSentinelButton('Nav')}
    </View>
  );
};

const StackCardView = props => {
  return (
    <View style={styles.container}>
      <Button
        title="Pop1"
        testID="pop1"
        onPress={() => props.navigation.pop()}
      />
    </View>
  );
};

const ModalCardView = props => {
  return (
    <View style={styles.container}>
      <Button
        title="Pop2"
        testID="pop2"
        onPress={() => props.navigation.pop()}
      />
    </View>
  );
};

export default createStackNavigator(
  {
    MainStack: createStackNavigator({
      Base: BaseView,
      StackCard: StackCardView,
    }),
    ModalStack: {
      screen: ModalCardView,
    },
  },
  { mode: 'modal', headerMode: 'none' }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
