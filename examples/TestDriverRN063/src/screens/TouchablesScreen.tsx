import React from 'react';
import { Button, TouchableOpacity, ScrollView, Text } from 'react-native';

export const TouchablesScreen = () => {
  return (
    <ScrollView>
      <Button title="Press me" onPress={() => console.log('pressed button')} />
      <TouchableOpacity
        onPress={() => console.log('pressed touchable opacity')}>
        <Text>Touchable Opacity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
