import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Heap, {
  HeapIgnore,
  HeapIgnoreTargetText,
} from '@heap/react-native-heap';
import { makeSentinelButton } from '../sentinelUtilities';

// Placeholder for identifying specific HeapIgnore'd subhierarchies.
const Foo = props => {
  return props.children;
};

const TouchableOpacityWithHeapIgnore = Heap.withHeapIgnore(TouchableOpacity);

export default class HeapIgnorePage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Foo>
          <HeapIgnore>
            <TouchableOpacity testID="totallyIgnored">
              <Text>Foobar</Text>
            </TouchableOpacity>
          </HeapIgnore>
        </Foo>
        <Foo>
          <TouchableOpacityWithHeapIgnore testID="totallyIgnoredHoc">
            <Text>Foobar</Text>
          </TouchableOpacityWithHeapIgnore>
        </Foo>
        <HeapIgnore allowInteraction={true}>
          <TouchableOpacity testID="allowedInteraction">
            <Text>Foobar</Text>
          </TouchableOpacity>
        </HeapIgnore>
        <HeapIgnore allowInteraction={true} allowInnerHierarchy={true}>
          <TouchableOpacity testID="allowedInnerHierarchy">
            <Text>Foobar</Text>
          </TouchableOpacity>
        </HeapIgnore>
        <HeapIgnore
          allowInteraction={true}
          allowInnerHierarchy={true}
          allowAllProps={true}
        >
          <TouchableOpacity testID="allowedAllProps">
            <Text>Foobar</Text>
          </TouchableOpacity>
        </HeapIgnore>
        <HeapIgnore
          allowInteraction={true}
          allowInnerHierarchy={true}
          allowTargetText={true}
        >
          <TouchableOpacity testID="allowedTargetText">
            <Text>Foobar</Text>
          </TouchableOpacity>
        </HeapIgnore>
        <HeapIgnoreTargetText>
          <TouchableOpacity testID="ignoredTargetText">
            <Text>Foobar</Text>
          </TouchableOpacity>
        </HeapIgnoreTargetText>
        {makeSentinelButton('HeapIgnore')}
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
