require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

nodeUtil = require('util');
testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

const HEAPIGNORE_PAGE_TOP_HIERARCHY =
  'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=HeapIgnore];|SceneView;|HeapIgnorePage;|';

const doTestActions = async () => {
  // Open the HeapIgnore tab in the tab navigator.
  await element(by.id('HeapIgnore')).tap();

  await expect(element(by.id('totallyIgnored'))).toBeVisible();
  await element(by.id('totallyIgnored')).tap();
  await element(by.id('totallyIgnoredHoc')).tap();

  await rnTestUtil.waitIfIos();

  await element(by.id('allowedInteraction')).tap();
  await element(by.id('allowedInnerHierarchy')).tap();
  await element(by.id('allowedAllProps')).tap();

  await rnTestUtil.waitIfIos();

  await element(by.id('allowedTargetText')).tap();
  await element(by.id('ignoredTargetText')).tap();

  await element(by.id('heapignoreSentinel')).tap();
};

describe('HeapIgnore', () => {
  before(async () => {
    await rnTestUtil.flushAllRedis();
    await doTestActions();
    await rnTestUtil.pollForSentinel('HeapIgnore');
  });

  it('should ignore the interaction', async () => {
    // Get all the events from redis, and assert that none of the requests match the ignored
    // interaction.
    const { err, res } = await rnTestUtil.findAllEvents();

    assert.not.exist(err);
    assert(res.length).not.equal(0);

    // The ignored interaction is within an instantiation of the "Foo" component, so assert that no
    // part of the event requests includes this as part of its hierarchy.
    assert(JSON.stringify(res)).not.match(/Foo;\|/);
  });

  it('should ignore the inner hierarchy', async () => {
    const expectedHierarchy = `${HEAPIGNORE_PAGE_TOP_HIERARCHY}HeapIgnore;|`;
    await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
      touchableHierarchy: expectedHierarchy,
    });
  });

  it('should ignore props and target text', async () => {
    const expectedHierarchy = `${HEAPIGNORE_PAGE_TOP_HIERARCHY}HeapIgnore;|TouchableOpacity;|`;
    await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
      touchableHierarchy: expectedHierarchy,
    });
  });

  it('should ignore props', async () => {
    const expectedHierarchy = `${HEAPIGNORE_PAGE_TOP_HIERARCHY}HeapIgnore;|TouchableOpacity;|`;
    await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
      touchableHierarchy: expectedHierarchy,
      targetText: 'Foobar',
    });
  });

  it('should ignore target text', async () => {
    const expectedHierarchy = `${HEAPIGNORE_PAGE_TOP_HIERARCHY}HeapIgnoreTargetText;|HeapIgnore;|TouchableOpacity;[testID=ignoredTargetText];|`;
    await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
      touchableHierarchy: expectedHierarchy,
    });
  });
});
