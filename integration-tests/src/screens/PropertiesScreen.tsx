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
      <Button
        title="Log getUserId"
        onPress={async () =>
          Heap.track('getUserId', {value: await Heap.getUserId()})
        }
      />
      <Button
        title="Log getSessionId"
        onPress={async () =>
          Heap.track('getSessionId', {value: await Heap.getSessionId()})
        }
      />
      <Button
        title="Send Custom Event"
        onPress={async () =>
          Heap.track('custom-event', { a: {b: null, c: [1,2,3], d: new (class Test {}) } })
        }
      />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};
