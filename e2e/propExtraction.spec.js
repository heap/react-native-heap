require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

const IOS_BUTTON_SUFFIX = 'TouchableOpacity;|';
const ANDROID_BUTTON_SUFFIX = 'TouchableNativeFeedback;|';

const doTestActions = async () => {
  await element(by.id('PropExtraction')).tap();

  await expect(element(by.id('button1'))).toBeVisible();
  await element(by.id('button1')).tap();
  await element(by.id('button2')).tap();
};

describe('Property Extraction in Hierarchies', () => {
  let buttonSuffix = '';

  before(async () => {
    await device.launchApp();
    buttonSuffix =
      device.getPlatform() === 'ios'
        ? IOS_BUTTON_SUFFIX
        : ANDROID_BUTTON_SUFFIX;
  });

  before(done => {
    db.orm.connection.sharedRedis().flushall(done);
  });

  describe('The property extractor', () => {
    before(async () => {
      await doTestActions();
      await rnTestUtil.waitForEventsToFlush();
    });

    it('works with class components', async () => {
      const expectedHierarchy = `AppContainer;|App;|Provider;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|PropExtraction;|Container1;[custom1=customProp1];|Button;[title=testButtonTitle1];|${buttonSuffix}`;
      const expectedTargetText =
        device.getPlatform() === 'ios'
          ? 'testButtonTitle1'
          : 'TESTBUTTONTITLE1';
      await rnTestUtil.assertAutotrackHierarchy(
        'touchableHandlePress',
        expectedHierarchy,
        expectedTargetText
      );
    });

    it('works with stateless components', async () => {
      const expectedHierarchy = `AppContainer;|App;|Provider;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|PropExtraction;|Container2;[custom2=customProp2];|Button;[title=testButtonTitle2];|${buttonSuffix}`;
      const expectedTargetText =
        device.getPlatform() === 'ios'
          ? 'testButtonTitle2'
          : 'TESTBUTTONTITLE2';
      await rnTestUtil.assertAutotrackHierarchy(
        'touchableHandlePress',
        expectedHierarchy,
        expectedTargetText
      );
    });
  });
});
