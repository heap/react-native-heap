/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Button,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';

const myRef = React.createRef<TextInput>();

const MyTextInput = () => {
  const [value, onChangeText] = React.useState<string>();

  return (
    <TextInput
      ref={myRef}
      testID="myTextInput"
      style={{height: 40, borderColor: 'gray', borderWidth: 1}}
      onChangeText={(text) => onChangeText(text)}
      value={value}
    />
  );
};

export const TouchablesScreen = () => {
  return (
    <ScrollView>
      <Button title="Press me" onPress={() => console.log('pressed button')} />
      <Button
        title="focus textinput"
        onPress={() => myRef.current.focus && myRef.current.focus()}
      />
      <TouchableOpacity
        onPress={() => console.log('pressed touchable opacity')}>
        <Text>Touchable Opacity</Text>
      </TouchableOpacity>
      <Pressable
        onPress={() => console.log('pressed pressable')}
        onPressIn={() => console.log('pressed in pressable')}>
        <Text>Pressable</Text>
      </Pressable>
      <MyTextInput />
    </ScrollView>
  );
};
