import React from 'react';
import {Button, ScrollView} from 'react-native';

export const HomeScreen = ({navigation}) => {
  return (
    <ScrollView>
      <Button
        title="Touchables"
        id="TESTTEST"
        onPress={() => navigation.navigate('Touchables')}
        onLongPress={() => console.log('long press')}
      />
      <Button
        title="Navigation"
        onPress={() => navigation.navigate('Navigation')}
      />
      <Button
        title="Properties"
        onPress={() => navigation.navigate('Properties')}
      />
    </ScrollView>
  );
};
