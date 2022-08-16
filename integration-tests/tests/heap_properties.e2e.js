/* global describe */
/* global it */
/* global beforeEach */
import assert from 'assert';
import {isAndroid, standardSetup, tapButton} from './util/util';
import {getPropertyValue} from './util/types';

describe('Heap Static Properties', () => {
  let tools = standardSetup(async () => {
    await tapButton('Properties');
  });

  describe('getUserId', () => {
    it('should match user.id', async () => {
      await tapButton('Log getUserId');

      const message = await tools.server.expectSourceCustomEventWithProperties(
        'getUserId',
      );

      const userIdFromPayload = isAndroid()
        ? message.user?.id?.value
        : message.user?.id;

      assert.notEqual(
        userIdFromPayload,
        undefined,
        'PRECONDITION: Unexpected issue reading user.id',
      );

      assert.equal(
        userIdFromPayload,
        getPropertyValue(
          'value',
          message.event.sourceCustomEvent.customProperties,
        ),
      );
    });
  });

  describe('getSessionId', () => {
    it('should match sessionInfo.id', async () => {
      await tapButton('Log getSessionId');

      const message = await tools.server.expectSourceCustomEventWithProperties(
        'getSessionId',
      );

      const sessionIdFromPayload = message.sessionInfo?.id;

      assert.notEqual(
        sessionIdFromPayload,
        undefined,
        'PRECONDITION: Unexpected issue reading sessionInfo.id',
      );

      assert.equal(
        sessionIdFromPayload,
        getPropertyValue(
          'value',
          message.event.sourceCustomEvent.customProperties,
        ),
      );
    });
  });

  describe('track', () => {
    it('Should serialize properties without crashing', async () => {
      await tapButton('Send Custom Event');

      const message = await tools.server.expectSourceCustomEventWithProperties(
        'custom-event',{
        'a.c.0': '1',
        'a.c.1': '2',
        'a.c.1': '3'}
      )
    })
  })
});
