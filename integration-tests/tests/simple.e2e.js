import {CaptureServer} from './server';

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
