import React from 'react';
import { NativeModules } from 'react-native';

import Heap from '../Heap';

describe('The Heap object', () => {
  let mockTrack,
    mockSetAppId,
    mockIdentify,
    mockAddUserProperties,
    mockAddEventProperties,
    mockRemoveEventProperty,
    mockClearEventProperties;

  beforeAll(() => {
    jest.mock('react-native');
  });

  beforeEach(() => {
    jest.resetModules();

    NativeModules.RNHeap.track.mockReset();
    mockTrack = NativeModules.RNHeap.track;

    NativeModules.RNHeap.setAppId.mockReset();
    mockSetAppId = NativeModules.RNHeap.setAppId;

    NativeModules.RNHeap.identify.mockReset();
    mockIdentify = NativeModules.RNHeap.identify;

    NativeModules.RNHeap.addUserProperties.mockReset();
    mockAddUserProperties = NativeModules.RNHeap.addUserProperties;

    NativeModules.RNHeap.addEventProperties.mockReset();
    mockAddEventProperties = NativeModules.RNHeap.addEventProperties;

    NativeModules.RNHeap.removeEventProperty.mockReset();
    mockRemoveEventProperty = NativeModules.RNHeap.removeEventProperty;

    NativeModules.RNHeap.clearEventProperties.mockReset();
    mockClearEventProperties = NativeModules.RNHeap.clearEventProperties;
  });

  describe('track', () => {
    const checkCommonExpectations = (expectedProps = {}) => {
      expect(mockTrack.mock.calls.length).toBe(1);
      expect(mockTrack.mock.calls[0][0]).toBe('foo');
      expect(mockTrack.mock.calls[0][1]).toEqual(expectedProps);
    };

    it('works in the common case', () => {
      Heap.track('foo', { bar: 'baz' });
      checkCommonExpectations({ bar: 'baz' });
    });

    it('properly flattens objects', () => {
      Heap.track('foo', { bar: { baz: 'quux' } });
      checkCommonExpectations({ 'bar.baz': 'quux' });
    });

    it('properly flattens arrays', () => {
      Heap.track('foo', { bar: ['baz'] });
      checkCommonExpectations({ 'bar.0': 'baz' });
    });

    it('accepts an empty property object', () => {
      Heap.track('foo', {});
      checkCommonExpectations();
    });

    it('accepts a null property object', () => {
      Heap.track('foo', null);
      checkCommonExpectations();
    });

    it('accepts an undefined property object', () => {
      Heap.track('foo');
      checkCommonExpectations();
    });

    it('fails gracefully with bad input', () => {
      const mockFlat = jest.fn(() => {
        throw new Error('Ignore meeeee!  I am expected!!');
      });
      jest.mock('flat', () => mockFlat);

      Heap.track('foo');
      expect(mockTrack.mock.calls.length).toBe(0);
    });
  });

  describe('Other functions', () => {
    it('setAppId - handles the common case', () => {
      Heap.setAppId('foo');
      expect(mockSetAppId.mock.calls.length).toBe(1);
      expect(mockSetAppId.mock.calls[0][0]).toBe('foo');
    });

    it('identify - handles the common case', () => {
      Heap.identify('foo');
      expect(mockIdentify.mock.calls.length).toBe(1);
      expect(mockIdentify.mock.calls[0][0]).toBe('foo');
    });

    it('addUserProperties - handles the common case', () => {
      Heap.addUserProperties({ foo: 'bar' });
      expect(mockAddUserProperties.mock.calls.length).toBe(1);
      expect(mockAddUserProperties.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });

    it('addEventProperties - handles the common case', () => {
      Heap.addEventProperties({ foo: 'bar' });
      expect(mockAddEventProperties.mock.calls.length).toBe(1);
      expect(mockAddEventProperties.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });

    it('removeEventProperty - handles the common case', () => {
      Heap.removeEventProperty('foo');
      expect(mockRemoveEventProperty.mock.calls.length).toBe(1);
      expect(mockRemoveEventProperty.mock.calls[0][0]).toBe('foo');
    });

    it('clearEventProperties - handles the common case', () => {
      Heap.clearEventProperties();
      expect(mockClearEventProperties.mock.calls.length).toBe(1);
      expect(mockRemoveEventProperty.mock.calls[0]).toBeUndefined();
    });
  });
});
