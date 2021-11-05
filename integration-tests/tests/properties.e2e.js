/* global describe */
/* global it */
/* global beforeAll */
/* global beforeEach */
/* global afterAll */
/* global device */
import {CaptureServer} from './util/server';
import assert from 'assert';
import {isAndroid, tapButton} from './util/util';
import {getPropertyValue} from './util/types';

describe('Properties', () => {
  let server;

  beforeAll(async () => {
    await device.launchApp();
    server = new CaptureServer();
    server.start(3000);
  });

  beforeEach(async () => {
    server.reset();
    await device.reloadReactNative();
    await tapButton('Properties');
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('Add user properties', () => {
    it('should send a pixel request', async () => {
      await tapButton('Add User Properties');
      await server.expectUserProperties({prop1: 'foo', prop2: 'bar'});
    });
  });

  describe('Identify', () => {
    var userId;

    it('should send a pixel request', async () => {
      await tapButton('Identify');
      userId = await server.expectIdentify('foobar');
    });

    it('should carry forward on future requests', async () => {
      let target_text = await tapButton('Back');

      const message = await server.expectSourceEventWithProperties('touch', {
        target_text,
        screen_name: 'Properties',
      });

      if (isAndroid()) {
        assert.equal(message.user?.id?.value, userId);
      } else {
        assert.equal(message.user?.id, userId);
        assert.equal(message.user?.identity, 'foobar');
      }
    });
  });

  describe('Event properties', () => {
    beforeEach(async () => {
      await tapButton('Add Event Properties');
    });

    it('should be added to requests', async () => {
      let target_text = await tapButton('Back');

      const message = await server.expectSourceEventWithProperties('touch', {
        target_text,
        screen_name: 'Properties',
      });

      assert.equal(getPropertyValue('eventProp1', message.properties), 'bar');
      assert.equal(getPropertyValue('eventProp2', message.properties), 'foo');
    });

    it('should be individually removable', async () => {
      await tapButton('Remove Event Property');
      let target_text = await tapButton('Back');

      const message = await server.expectSourceEventWithProperties('touch', {
        target_text,
        screen_name: 'Properties',
      });

      assert.equal(getPropertyValue('eventProp2', message.properties), 'foo');
      assert.equal(
        getPropertyValue('eventProp1', message.properties),
        undefined,
      );
    });

    it('should be clearable', async () => {
      await tapButton('Clear Event Properties');
      let target_text = await tapButton('Back');

      const message = await server.expectSourceEventWithProperties('touch', {
        target_text,
        screen_name: 'Properties',
      });

      assert.equal(message.properties, undefined);
    });
  });
});
