/* global describe */
/* global it */
import {booleanValue, standardSetup, tapButton} from './util/util';

describe('On a simple touch navigation', () => {
  let tools = standardSetup();

  it('the app should emit touch and pageview events', async () => {
    let target_text = await tapButton('Touchables');

    await tools.server.expectSourceEventWithProperties('touch', {
      target_text,
      screen_path: 'Home',
      screen_name: 'Home',
      is_using_react_navigation_hoc: booleanValue(true),
      is_long_press: booleanValue(false),
    });

    await tools.server.expectSourceEventWithProperties(
      'react_navigation_screenview',
      {
        screen_path: 'Touchables',
        screen_name: 'Touchables',
        is_using_react_navigation_hoc: booleanValue(true),
      },
    );
  });
});
