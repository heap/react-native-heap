import React, { Component } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Switch as NbSwitch } from 'native-base';
import { connect } from 'react-redux';

import Heap from '@heap/react-native-heap';
import { incrementAction, decrementAction } from '../reduxElements';
import { makeSentinelButton } from '../sentinelUtilities';

class BasicsPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NbSwitch
          testID="nbSwitch"
          onValueChange={() => console.log('stuff')}
        />
        <Switch testID="switch" onValueChange={() => console.log('stuff')} />
        <Button
          testID="track1"
          title="Call Track1"
          onPress={() => Heap.track('pressInTestEvent1', {})}
        />
        <Button
          testID="track2"
          title="Call Track2"
          onPress={() => Heap.track('pressInTestEvent2', {})}
        />
        <Button
          testID="track3"
          title="Call Track3"
          onPress={() => Heap.track('pressInTestEvent3', {})}
        />
        <Button
          testID="track4"
          title="Call Track4"
          onPress={() => Heap.track('pressInTestEvent4', {})}
        />
        <Button
          testID="aup"
          title="Call AUP"
          onPress={() => Heap.addUserProperties({ prop1: 'foo', prop2: 'bar' })}
        />
        <Button
          testID="identify"
          title="Call Identify"
          onPress={() => Heap.identify('foobar')}
        />
        <Button
          testID="aep"
          title="Add Event Properties"
          onPress={() =>
            Heap.addEventProperties({ eventProp1: 'bar', eventProp2: 'foo' })
          }
        />
        <Button
          testID="removeProp"
          title="Remove eventProp1"
          onPress={() => Heap.removeEventProperty('eventProp1')}
        />
        <Button
          testID="clearProps"
          title="Clear Event Properties"
          onPress={() => Heap.clearEventProperties()}
        />
        <TouchableOpacity testID="touchableOpacityText">
          <Text>Touchable Opacity</Text>
          <Text>Foo</Text>
        </TouchableOpacity>
        <TouchableHighlight testID="touchableHighlightText">
          <Text>Touchable Highlight</Text>
        </TouchableHighlight>
        <TouchableWithoutFeedback testID="touchableWithoutFeedbackText">
          <Text>Touchable Without Feedback</Text>
        </TouchableWithoutFeedback>
        {Platform.OS === 'android' && (
          <TouchableNativeFeedback testID="touchableNativeFeedbackText">
            <Text>Touchable Native Feedback</Text>
          </TouchableNativeFeedback>
        )}
        {makeSentinelButton('Basics')}
      </View>
    );
  }
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
)(BasicsPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
