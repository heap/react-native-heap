require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

nodeUtil = require('util');
testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

const doTestActions = async () => {
  // Open the HeapIgnore tab in the tab navigator.
  await element(by.id('HeapIgnore')).tap();

  await expect(element(by.id('totallyIgnored'))).toBeVisible();
  await element(by.id('totallyIgnored')).tap();
  await element(by.id('totallyIgnoredHoc')).tap();
  await element(by.id('allowedInteraction')).tap();
  await element(by.id('allowedInnerHierarchy')).tap();
  await element(by.id('allowedAllProps')).tap();

  // :HACK: Break up long URL.
  // :TODO: Remove once pixel endpoint is handling larger events again.
  console.log('Waiting 15s to flush iOS events.');
  await new Promise(resolve => setTimeout(resolve, 15000));
  await element(by.id('allowedTargetText')).tap();
  await element(by.id('ignoredTargetText')).tap();

  await element(by.id('heapignoreSentinel')).tap();
};

describe('HeapIgnore', () => {
  before(done => {
    db.orm.connection.sharedRedis().flushall(done);
  });

  before(async () => {
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
    const expectedHierarchy =
      'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=HeapIgnore];|SceneView;|HeapIgnorePage;|HeapIgnore;|';
    await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
      touchableHierarchy: expectedHierarchy,
    });
  });

  it('should ignore props and target text', async () => {
    const expectedHierarchy =
      'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=HeapIgnore];|SceneView;|HeapIgnorePage;|HeapIgnore;|TouchableOpacity;|';
    await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
      touchableHierarchy: expectedHierarchy,
    });
  });

  it('should ignore props', async () => {
    const expectedHierarchy =
      'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=HeapIgnore];|SceneView;|HeapIgnorePage;|HeapIgnore;|TouchableOpacity;|';
    await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
      touchableHierarchy: expectedHierarchy,
      targetText: 'Foobar',
    });
  });

  it('should ignore target text', async () => {
    const expectedHierarchy =
      'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=HeapIgnore];|SceneView;|HeapIgnorePage;|HeapIgnoreTargetText;|HeapIgnore;|TouchableOpacity;[testID=ignoredTargetText];|';
    await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
      touchableHierarchy: expectedHierarchy,
    });
  });
});
