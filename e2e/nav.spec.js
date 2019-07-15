require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

const delay = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

const doTestActions = async () => {
  // Open the PropExtraction tab in the tab navigator.
  await element(by.id('Nav')).tap();

  await expect(element(by.id('navigate_stack'))).toBeVisible();
  await element(by.id('navigate_stack')).tap();
  await delay();
  await expect(element(by.id('pop1'))).toBeVisible();
  await element(by.id('pop1')).tap();
  await delay();

  // :HACK: Break up long URL.
  // :TODO: Remove once pixel endpoint is handling larger events again.
  console.log('Waiting 15s to flush iOS events.');
  await new Promise(resolve => setTimeout(resolve, 15000));

  await expect(element(by.id('navigate_modal'))).toBeVisible();
  await element(by.id('navigate_modal')).tap();
  await delay();
  await expect(element(by.id('pop2'))).toBeVisible();
  await element(by.id('pop2')).tap();
  await delay();

  await element(by.id('navSentinel')).tap();
};

describe('Navigation', () => {
  before(done => {
    db.orm.connection.sharedRedis().flushall(done);
  });

  describe('React Navigation autotrack', () => {
    before(async () => {
      await doTestActions();
      await rnTestUtil.pollForSentinel('Nav');
    });

    it('tracks a tab navigator action', async () => {
      await rnTestUtil.assertNavigationEvent(
        'Nav::MainStack::Base',
        'Navigation/NAVIGATE'
      );
    });

    it('tracks a stack navigator action', async () => {
      await rnTestUtil.assertNavigationEvent(
        'Nav::MainStack::StackCard',
        'Navigation/NAVIGATE'
      );

      await rnTestUtil.assertNavigationEvent(
        'Nav::MainStack::Base',
        'Navigation/POP'
      );
    });

    it('tracks a modal stack navigator action', async () => {
      await rnTestUtil.assertNavigationEvent(
        'Nav::ModalStack',
        'Navigation/NAVIGATE'
      );
    });

    it('tracks events with screen name props', async () => {
      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        screenName: 'Base',
        path: 'Nav::MainStack::Base',
      });

      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        screenName: 'StackCard',
        path: 'Nav::MainStack::StackCard',
      });

      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        screenName: 'ModalStack',
        path: 'Nav::ModalStack',
      });
    });

    it("doesn't crash when ref is used for navigation without navigation prop", async () => {
      await element(by.id('navigate_without_prop')).tap();
      // Check that app doesn't crash by asserting the button is still visible.
      await expect(element(by.id('navigate_without_prop'))).toBeVisible();
    });
  });
});
