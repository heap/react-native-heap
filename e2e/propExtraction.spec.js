require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

const IOS_BUTTON_SUFFIX = 'TouchableOpacity;';
const ANDROID_BUTTON_SUFFIX = 'TouchableNativeFeedback;';

const PROPEXTRACTION_PAGE_TOP_HIERARCHY = 'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=PropExtraction];|SceneView;|PropExtraction;|';

const doTestActions = async () => {
  // Open the PropExtraction tab in the tab navigator.
  await element(by.id('PropExtraction')).tap();

  await rnTestUtil.waitIfIos();

  await expect(element(by.id('button1'))).toBeVisible();
  await element(by.id('button1')).tap();
  await element(by.id('button2')).tap();

  await rnTestUtil.waitIfIos();

  await element(by.id('button3')).tap();

  await element(by.id('propextractionSentinel')).tap();
};

describe('Property Extraction in Hierarchies', () => {
  let buttonSuffix = '';

  before(async () => {
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
      await rnTestUtil.pollForSentinel('PropExtraction');
    });

    it('works with class components', async () => {
      const expectedHierarchy = `${PROPEXTRACTION_PAGE_TOP_HIERARCHY}Container1;[custom1=customProp1];|Button;[testID=button1];[title=testButtonTitle1];|${buttonSuffix}[testID=button1];|`;
      const expectedTargetText =
        device.getPlatform() === 'ios'
          ? 'testButtonTitle1'
          : 'TESTBUTTONTITLE1';
      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        touchableHierarchy: expectedHierarchy,
        targetText: expectedTargetText,
      });
    });

    it('works with stateless components', async () => {
      const expectedHierarchy = `${PROPEXTRACTION_PAGE_TOP_HIERARCHY}Container2;[custom2=customProp2];|Button;[testID=button2];[title=testButtonTitle2];|${buttonSuffix}[testID=button2];|`;
      const expectedTargetText =
        device.getPlatform() === 'ios'
          ? 'testButtonTitle2'
          : 'TESTBUTTONTITLE2';
      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        touchableHierarchy: expectedHierarchy,
        targetText: expectedTargetText,
      });
    });

    it('properly excludes properties', async () => {
      // The important thing for this test is that the first mention of 'Button' does NOT include the title property.
      // This is because the first one is a custom class that specifically excludes (while the second one is the built-in Button.)
      const expectedHierarchy = `${PROPEXTRACTION_PAGE_TOP_HIERARCHY}Button;|Button;[testID=button3];[title=testButtonTitle3];|${buttonSuffix}[testID=button3];|`;
      const expectedTargetText =
        device.getPlatform() === 'ios'
          ? 'testButtonTitle3'
          : 'TESTBUTTONTITLE3';
      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        touchableHierarchy: expectedHierarchy,
        targetText: expectedTargetText,
      });
    });
  });
});
