/* global describe */
/* global it */
/* global beforeAll */
/* global beforeEach */
/* global afterAll */
/* global device */
import {CaptureServer} from './util/server';
import {booleanValue, tapButton} from './util/util';

describe('On a simple touch navigation', () => {
  let server;

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
    let target_text = await tapButton('Touchables');

    await server.expectSourceEventWithProperties('touch', {
      target_text,
      screen_path: 'Home',
      screen_name: 'Home',
      is_using_react_navigation_hoc: booleanValue(true),
      is_long_press: booleanValue(false),
    });

    await server.expectSourceEventWithProperties(
      'react_navigation_screenview',
      {
        screen_path: 'Touchables',
        screen_name: 'Touchables',
        is_using_react_navigation_hoc: booleanValue(true),
      },
    );
  });
});
