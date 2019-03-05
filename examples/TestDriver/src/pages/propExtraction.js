import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';

class Container1 extends Component {
  heapOptions = { eventProps: { include: ['custom1'] } };

  render() {
    return <Button title="testButtonTitle1" testID="button1" />;
  }
}

const Container2 = () => {
  return <Button title="testButtonTitle2" testID="button2" />;
};
Container2.heapOptions = { eventProps: { include: ['custom2'] } };

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
