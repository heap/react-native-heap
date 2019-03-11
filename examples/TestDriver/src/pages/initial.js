import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class InitialPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>react-native-heap TestDriver</Text>
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
