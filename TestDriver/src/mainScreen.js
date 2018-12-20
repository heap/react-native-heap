import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import Heap from 'react-native-heap-analytics';
import { incrementAction, decrementAction } from './reduxElements';

class MainScreen extends Component {
  componentDidMount() {
    Heap.setAppId('2084764307');
    Heap.identify('foo');
    console.log('Heap App ID set');
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Send Manual Event" onPress={this.sendManualEvent} />
        <Text>Current value is: {this.props.value}</Text>
        <Button title="Increment" onPress={() => this.props.onIncrement(3)} />
        <Button title="Decrement" onPress={() => this.props.onDecrement(7)} />
      </View>
    );
  }

  sendManualEvent = () => {
    Heap.track('manual_button_pressed', { foo: 'bar' });
    console.log('Manual tracking event sent');
  };
}

export default connect(
  state => {
    return { value: state.value };
  },
  dispatch => {
    return {
      onIncrement: amount => dispatch(incrementAction(amount)),
      onDecrement: amount => dispatch(decrementAction(amount)),
    };
  }
)(MainScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
