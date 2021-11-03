import { CaptureServer } from './server';

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

  it('the app should emit ', async () => {
    await element(by.label('Touchables')).tap();

    await server.expectSourceEventWithProperties("touch", {
      target_text: "Touchables",
      screen_path: "Home",
      screen_name: "Home",
      is_using_react_navigation_hoc: true,
      is_long_press: false,
    });

    await server.expectSourceEventWithProperties("react_navigation_screenview", {
      screen_path: "Touchables",
      screen_name: "Touchables",
      is_using_react_navigation_hoc: true,
    });
  });
});
