import React from 'react';
import { Button, TouchableOpacity, ScrollView, Text, TextInput } from 'react-native';

const MyTextInput = () => {
  const [value, onChangeText] = React.useState();

  return (
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => onChangeText(text)}
      value={value}
    />
  );
}

export const TouchablesScreen = () => {
  return (
    <ScrollView>
      <Button title="Press me" onPress={() => console.log('pressed button')} />
      <TouchableOpacity
        onPress={() => console.log('pressed touchable opacity')}>
        <Text>Touchable Opacity</Text>
      </TouchableOpacity>
      <MyTextInput />
    </ScrollView>
  );
};
