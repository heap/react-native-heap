import React, { Component } from 'react';
import {
  Button,
  FlatList,
  Platform,
  ScrollView,
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
import * as _ from 'lodash';

import Heap from '@heap/react-native-heap';
import { incrementAction, decrementAction } from '../reduxElements';
import { makeSentinelButton } from '../sentinelUtilities';

const ITEMS = _.range(30).map(_.toString);

class BasicsPage extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <NbSwitch testID="nbSwitch" />
        <Switch testID="switch" />
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
          testID="resetIdentity"
          title="Call Reset Identity"
          onPress={() => Heap.resetIdentity()}
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
        <FlatList
          style={{
            width: 250,
            borderRadius: 4,
            borderWidth: 0.5,
            borderColor: 'black',
          }}
          onMomentumScrollEnd={event => console.log(event.nativeEvent)}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 5 }}>
              <Text>Scrollview</Text>
              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={item => item}
          ref={(ref: any): void => {
            this._pagesListRef = ref;
          }}
          bounces={false}
          pagingEnabled
          data={ITEMS}
          horizontal
          testID="scrollView"
        />
        {makeSentinelButton('Basics')}
      </ScrollView>
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
    height: 650,
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
