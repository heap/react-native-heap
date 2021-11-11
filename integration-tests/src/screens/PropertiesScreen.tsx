import React from 'react';
import {Button, ScrollView} from 'react-native';
import Heap from '@heap/react-native-heap';

export const PropertiesScreen = ({navigation}) => {
  return (
    <ScrollView>
      <Button
        title="Add User Properties"
        onPress={() => Heap.addUserProperties({prop1: 'foo', prop2: 'bar'})}
      />
      <Button
        testID="identify"
        title="Identify"
        onPress={() => Heap.identify('foobar')}
      />
      <Button
        title="Add Event Properties"
        onPress={() =>
          Heap.addEventProperties({eventProp1: 'bar', eventProp2: 'foo'})
        }
      />
      <Button
        title="Remove Event Property"
        onPress={() => Heap.removeEventProperty('eventProp1')}
      />
      <Button
        title="Clear Event Properties"
        onPress={() => Heap.clearEventProperties()}
      />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};
