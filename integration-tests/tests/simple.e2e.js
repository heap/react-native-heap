import {CaptureServer} from './server';
import assert from 'assert';

function buttonCase(text) {
  if (device.type === 'android.emulator') {
    return text.toUpperCase();
  } else {
    return text;
  }
}

function booleanProperty(value) {
  if (device.type === 'android.emulator') {
    return value ? 'true' : 'false';
  } else {
    return value;
  }
}

let server;

describe('On a simple touch navigation', () => {
  beforeAll(async () => {
    await device.launchApp();
    server = new CaptureServer();
    server.start(3000);
  });

  beforeEach(async () => {
    server.reset();
    await device.reloadReactNative();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('the app should emit touch and pageview events', async () => {
    await element(by.text(buttonCase('Touchables'))).tap();

    await server.expectSourceEventWithProperties('touch', {
      target_text: buttonCase('Touchables'),
      screen_path: 'Home',
      screen_name: 'Home',
      is_using_react_navigation_hoc: booleanProperty(true),
      is_long_press: booleanProperty(false),
    });

    await server.expectSourceEventWithProperties(
      'react_navigation_screenview',
      {
        screen_path: 'Touchables',
        screen_name: 'Touchables',
        is_using_react_navigation_hoc: booleanProperty(true),
      },
    );
  });
});

describe('Properties', () => {
  beforeAll(async () => {
    await device.launchApp();
    server = new CaptureServer();
    server.start(3000);
  });

  beforeEach(async () => {
    server.reset();
    await device.reloadReactNative();
    await element(by.text(buttonCase('Properties'))).tap();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('Add user properties', () => {
    it('should send a pixel request', async () => {
      await element(by.text(buttonCase('Add User Properties'))).tap();

      await server.expectUserProperties({prop1: 'foo', prop2: 'bar'});
    });
  });

  describe('Identify', () => {
    var userId;

    it('should send a pixel request', async () => {
      await element(by.text(buttonCase('Identify'))).tap();

      userId = await server.expectIdentify('foobar');
    });

    it('should carry forward on future requests', async () => {
      await element(by.text(buttonCase('Back'))).tap();

      const message = await server.expectSourceEventWithProperties('touch', {
        target_text: buttonCase('Back'),
        screen_name: 'Properties',
      });

      assert.equal(message.user?.identity, 'foobar');
      assert.equal(message.user?.id, userId);
    });
  });
});
