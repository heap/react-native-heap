require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

const IOS_BUTTON_SUFFIX = 'TouchableOpacity;';
const ANDROID_BUTTON_SUFFIX = 'TouchableNativeFeedback;';

const doTestActions = async () => {
  // Open the PropExtraction tab in the tab navigator.
  await element(by.id('PropExtraction')).tap();

  await expect(element(by.id('button1'))).toBeVisible();
  await element(by.id('button1')).tap();
  await element(by.id('button2')).tap();
  await element(by.id('button3')).tap();
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
      const expectedHierarchy = `AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|PropExtraction;|Container1;[custom1=customProp1];|Button;[testID=button1];[title=testButtonTitle1];|${buttonSuffix}[testID=button1];|`;
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
      const expectedHierarchy = `AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|PropExtraction;|Container2;[custom2=customProp2];|Button;[testID=button2];[title=testButtonTitle2];|${buttonSuffix}[testID=button2];|`;
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

    it('properly excludes properties', async () => {
      // The important thing for this test is that the first mention of 'Button' does NOT include the title property.
      // This is because the first one is a custom class that specifically excludes (while the second one is the built-in Button.)
      const expectedHierarchy = `AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|PropExtraction;|Button;|Button;[testID=button3];[title=testButtonTitle3];|${buttonSuffix}[testID=button3];|`;
      const expectedTargetText =
        device.getPlatform() === 'ios'
          ? 'testButtonTitle3'
          : 'TESTBUTTONTITLE3';
      await rnTestUtil.assertAutotrackHierarchy(
        'touchableHandlePress',
        expectedHierarchy,
        expectedTargetText
      );
    });
  });
});
