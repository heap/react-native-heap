import React from 'react';
import { NativeModules } from 'react-native';

import Heap from '../Heap';

describe('The Heap object', () => {
  describe('track', () => {
    let mockTrack;

    beforeAll(() => {
      jest.mock('react-native');
    });

    beforeEach(() => {
      jest.resetModules();
      NativeModules.RNHeap.track.mockReset();
      mockTrack = NativeModules.RNHeap.track;
    });

    const checkCommonExpectations = () => {
      expect(mockTrack.mock.calls.length).toBe(1);
      expect(mockTrack.mock.calls[0][0]).toBe('foo');
      expect(mockTrack.mock.calls[0][1]).toEqual({});
    };

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
});
