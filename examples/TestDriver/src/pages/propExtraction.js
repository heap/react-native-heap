import React, { Component } from 'react';
import { Button as BuiltInButton, StyleSheet, View } from 'react-native';

class Container1 extends Component {
  heapOptions = { eventProps: { include: ['custom1'] } };

  render() {
    return (
      <BuiltInButton
        title="testButtonTitle1"
        testID="button1"
        onPress={() => {}}
      />
    );
  }
}

const Container2 = () => {
  return (
    <BuiltInButton
      title="testButtonTitle2"
      testID="button2"
      onPress={() => {}}
    />
  );
};
Container2.heapOptions = { eventProps: { include: ['custom2'] } };

// We need something with the same name as the built-in button, so we can
// check for excluding props.
class Button extends Component {
  heapOptions = { eventProps: { include: [], exclude: ['title'] } };

  render() {
    return (
      <BuiltInButton
        title="testButtonTitle3"
        testID="button3"
        onPress={() => {}}
      />
    );
  }
}

export default class PropExtraction extends Component {
  static navigationOptions = () => {
    return {
      title: 'PropExtraction',
      tabBarLabel: 'PropExtraction',
      tabBarAccessibilityLabel: 'PropExtraction',
      tabBarTestID: 'PropExtraction',
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Container1 custom1="customProp1" />
        <Container2 custom2="customProp2" />
        <Button title="excludedProp" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
