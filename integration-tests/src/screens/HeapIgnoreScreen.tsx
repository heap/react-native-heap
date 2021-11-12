import React from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Heap, {HeapIgnore, HeapIgnoreTargetText} from '@heap/react-native-heap';

// Placeholder for identifying specific HeapIgnore'd subhierarchies.
const Foo = ({children}) => {
  return <>{children}</>;
};

const TouchableOpacityWithHeapIgnore = Heap.withHeapIgnore(TouchableOpacity);

const TouchableOpacityWithHeapIgnoredTargetText = Heap.withHeapIgnore(
  TouchableOpacity,
  {
    allowInteraction: true,
    allowInnerHierarchy: true,
    allowAllProps: true,
    allowTargetText: false,
  },
);

export const HeapIgnoreScreen = () => {
  return (
    <View style={styles.container}>
      <Button title="Sentinel" onPress={() => console.log('sentinel tapped')} />
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
      <TouchableOpacityWithHeapIgnoredTargetText testID="allowedAllPropsHoc">
        <Text>Foobar</Text>
      </TouchableOpacityWithHeapIgnoredTargetText>
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
        allowAllProps={true}>
        <TouchableOpacity testID="allowedAllProps">
          <Text>Foobar</Text>
        </TouchableOpacity>
      </HeapIgnore>
      <HeapIgnore
        allowInteraction={true}
        allowInnerHierarchy={true}
        allowTargetText={true}>
        <TouchableOpacity testID="allowedTargetText">
          <Text>Foobar</Text>
        </TouchableOpacity>
      </HeapIgnore>
      <HeapIgnoreTargetText>
        <TouchableOpacity testID="ignoredTargetText">
          <Text>Foobar</Text>
        </TouchableOpacity>
      </HeapIgnoreTargetText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
