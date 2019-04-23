require('coffeescript').register();

testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

// This file is named funkily so that Mocha runs this first.  That way we
// don't lose the initial navigation event (each test flushes redis).

describe('Initial Navigation', () => {
  before(async () => {
    await device.launchApp();

    await expect(element(by.id('initialSentinel'))).toBeVisible();
    await element(by.id('initialSentinel')).tap();

    await rnTestUtil.pollForSentinel('Initial');
  });

  it('tracks the initial route', async () => {
    await rnTestUtil.assertNavigationEvent('Initial', 'Heap_Navigation/INITIAL');
  });
});
