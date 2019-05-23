require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

nodeUtil = require('util');
testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

const doTestActions = async () => {
  // Open the Basics tab in the tab navigator.
  await element(by.id('Basics')).tap();

  await expect(element(by.id('track1'))).toBeVisible();
  await element(by.id('track1')).tap();
  await element(by.id('aep')).tap();
  await element(by.id('track2')).tap();

  // :HACK: Break up long URL.
  // :TODO: Remove once pixel endpoint is handling larger events again.
  console.log('Waiting 15s to flush iOS events.');
  await new Promise(resolve => setTimeout(resolve, 15000));

  await element(by.id('removeProp')).tap();
  await element(by.id('track3')).tap();
  await element(by.id('clearProps')).tap();
  await element(by.id('track4')).tap();
  await element(by.id('aup')).tap();
  await element(by.id('identify')).tap();

  // :HACK: Break up long URL.
  // :TODO: Remove once pixel endpoint is handling larger events again.
  console.log('Waiting 15s to flush iOS events.');
  await new Promise(resolve => setTimeout(resolve, 15000));

  await element(by.id('touchableOpacityText')).tap();
  await element(by.id('touchableHighlightText')).tap();
  await element(by.id('touchableWithoutFeedbackText')).tap();

  if (device.getPlatform() === 'android') {
    await element(by.id('touchableNativeFeedbackText')).tap();
  }

  await element(by.id('switch')).tap();
  await element(by.id('nbSwitch')).tap();

  await element(by.id('basicsSentinel')).tap();
};

describe('Basic React Native and Interaction Support', () => {
  before(done => {
    db.orm.connection.sharedRedis().flushall(done);
  });

  describe(':ios: Bridge API', () => {
    before(async () => {
      await doTestActions();
      await rnTestUtil.pollForSentinel('Basics');
    });

    it('should call first track', async () => {
      await rnTestUtil.assertIosPixel(
        { a: '2084764307', t: 'pressInTestEvent1' },
        event => {
          return !(
            _.includes(event.k, 'eventProp1') ||
            _.includes(event.k, 'eventProp2')
          );
        }
      );
    });

    it('should add event properties', async () => {
      await rnTestUtil.assertIosPixel(
        { a: '2084764307', t: 'pressInTestEvent2' },
        event => {
          return (
            _.includes(event.k, 'eventProp1') &&
            _.includes(event.k, 'eventProp2')
          );
        }
      );
    });

    it('should remove event properties', async () => {
      await rnTestUtil.assertIosPixel(
        { a: '2084764307', t: 'pressInTestEvent3' },
        event => {
          return (
            !_.includes(event.k, 'eventProp1') &&
            _.includes(event.k, 'eventProp2')
          );
        }
      );
    });

    it('should clear event properties', async () => {
      await rnTestUtil.assertIosPixel(
        { a: '2084764307', t: 'pressInTestEvent4' },
        event => {
          return !(
            _.includes(event.k, 'eventProp1') ||
            _.includes(event.k, 'eventProp2')
          );
        }
      );
    });

    it('should add user properties', async () => {
      const { err, res } = await new Promise(resolve => {
        testUtil.findAddUserPropertiesRequestsInRedis((err, res) => {
          resolve({ err, res });
        });
      });

      assert.not.exist(err);
      assert(res.length).equal(1);
      assert(res[0]['_prop1']).equal('foo');
      assert(res[0]['_prop2']).equal('bar');
    });

    it('should send identify', async () => {
      const { err, res } = await new Promise(resolve => {
        testUtil.findIdentifyRequestsInRedis((err, res) => {
          resolve({ err, res });
        });
      });

      assert.not.exist(err);
      assert(res.length).equal(1);
      assert(res[0]['i']).equal('foobar');
    });
  });

  describe(':android: Bridge API', () => {
    before(async () => {
      await doTestActions();
      await rnTestUtil.pollForSentinel('Basics');
    });

    it('should call first track', async () => {
      await rnTestUtil.assertAndroidEvent(
        {
          envId: '2084764307',
          event: { custom: { name: 'pressInTestEvent1' } },
        },
        event => {
          return (
            !_.has(event.properties, 'eventProp1') &&
            !_.has(event.properties, 'eventProp2')
          );
        }
      );
    });

    it('preserve the same session between track calls', async () => {
      const findAndroidEvent = nodeUtil.promisify(testUtil.findAndroidEventInRedisRequests);

      const [[event1], [event2]] = await Promise.all([
        findAndroidEvent({ envId: '2084764307', event: { custom: { name: 'pressInTestEvent1' } } }),
        findAndroidEvent({ envId: '2084764307', event: { custom: { name: 'pressInTestEvent2' } } })
      ]);

      assert(event1.sessionInfo.id).equal(event2.sessionInfo.id);
    });

    it('should add event properties', async () => {
      await rnTestUtil.assertAndroidEvent(
        {
          envId: '2084764307',
          event: { custom: { name: 'pressInTestEvent2' } },
        },
        event => {
          return (
            _.has(event.properties, 'eventProp1') &&
            _.has(event.properties, 'eventProp2')
          );
        }
      );
    });

    it('should remove event properties', async () => {
      await rnTestUtil.assertAndroidEvent(
        {
          envId: '2084764307',
          event: { custom: { name: 'pressInTestEvent3' } },
        },
        event => {
          return (
            !_.has(event.properties, 'eventProp1') &&
            _.has(event.properties, 'eventProp2')
          );
        }
      );
    });

    it('should clear event properties', async () => {
      await rnTestUtil.assertAndroidEvent(
        {
          envId: '2084764307',
          event: { custom: { name: 'pressInTestEvent4' } },
        },
        event => {
          return (
            !_.has(event.properties, 'eventProp1') &&
            !_.has(event.properties, 'eventProp2')
          );
        }
      );
    });

    it('should add user properties', async () => {
      const { err, res } = await new Promise(resolve => {
        testUtil.findAndroidAupInRedisRequests((err, res) => {
          resolve({ err, res });
        });
      });

      assert.not.exist(err);
      // Android might send an AUP with initial props when the app first opens.
      assert(res.length).not.equal(0);
      assert(res[0]['properties']).deepEqual({
        prop2: { string: 'bar' },
        prop1: { string: 'foo' },
      });
    });

    it('should send identify', async () => {
      const { err, res } = await new Promise(resolve => {
        testUtil.findAndroidIdentifyInRedisRequests((err, res) => {
          resolve({ err, res });
        });
      });

      assert.not.exist(err);
      assert(res.length).equal(1);
      assert(res[0]['toIdentity']).equal('foobar');
    });
  });

  describe('Autotrack', () => {
    it("should autotrack 'TouchableOpacity's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=Basics];|SceneView;|Connect(BasicsPage);|BasicsPage;|TouchableOpacity;[testID=touchableOpacityText];|';
      const expectedTargetText = 'Touchable Opacity Foo';
      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        touchableHierarchy: expectedHierarchy,
        targetText: expectedTargetText,
      });
    });

    it("should autotrack 'TouchableHighlight's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=Basics];|SceneView;|Connect(BasicsPage);|BasicsPage;|TouchableHighlight;[testID=touchableHighlightText];|';
      const expectedTargetText = 'Touchable Highlight';
      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        touchableHierarchy: expectedHierarchy,
        targetText: expectedTargetText,
      });
    });

    it("should autotrack 'TouchableWithoutFeedback's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=Basics];|SceneView;|Connect(BasicsPage);|BasicsPage;|TouchableWithoutFeedback;[testID=touchableWithoutFeedbackText];|';
      const expectedTargetText = 'Touchable Without Feedback';
      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        touchableHierarchy: expectedHierarchy,
        targetText: expectedTargetText,
      });
    });

    it(":android: should autotrack 'TouchableNativeFeedback's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=Basics];|SceneView;|Connect(BasicsPage);|BasicsPage;|TouchableNativeFeedback;[testID=touchableNativeFeedbackText];|';
      const expectedTargetText = 'Touchable Native Feedback';
      await rnTestUtil.assertAutotrackHierarchy('touchableHandlePress', {
        touchableHierarchy: expectedHierarchy,
        targetText: expectedTargetText,
      });
    });

    it("should autotrack 'Switch's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=Basics];|SceneView;|Connect(BasicsPage);|BasicsPage;|Switch;[testID=switch];|';
      await rnTestUtil.assertAutotrackHierarchy('_handleChange', {
        touchableHierarchy: expectedHierarchy,
      });
    });

    it("should autotrack NativeBase 'Switch's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|HeapNavigationWrapper;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=Basics];|SceneView;|Connect(BasicsPage);|BasicsPage;|StyledComponent;[testID=nbSwitch];|Switch;[testID=nbSwitch];|Switch;[testID=nbSwitch];|';
      await rnTestUtil.assertAutotrackHierarchy('_handleChange', {
        touchableHierarchy: expectedHierarchy,
      });
    });
  });
});
