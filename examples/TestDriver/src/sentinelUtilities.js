import React from 'react';
import { Button } from 'react-native';

import Heap from '@heap/react-native-heap';

export const makeSentinelTestID = key => {
  return `${key.toLowerCase()}Sentinel`;
};

export const makeSentinelEventName = key => {
  return `${key.toUpperCase()}_SENTINEL`;
};

export const makeSentinelButtonTitle = key => {
  return `Send ${key} Sentinel`;
};

export const makeSentinelButton = key => {
  return (
    <Button
      title={makeSentinelButtonTitle(key)}
      testID={makeSentinelTestID(key)}
      onPress={() => {
        Heap.track(makeSentinelEventName(key));
      }}
    />
  );
};
