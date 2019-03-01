require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

db = require('../../heap/back/db');
testUtil = require('../../heap/test/util');

const assertEvent = (err, res, check) => {
  assert.not.exist(err);
  assert(res.length).not.equal(0);

  if (_.isFunction(check)) {
    assert(res.filter(check).length).not.equal(0);
  }
};

const assertIosPixel = async (event, check) => {
  const { err, res } = await new Promise((resolve, reject) => {
    testUtil.findEventInRedisRequests(event, (err, res) => {
      resolve({ err, res });
    });
  });

  assertEvent(err, res, check);
};

const assertAndroidEvent = async (event, check) => {
  const { err, res } = await new Promise((resolve, reject) => {
    testUtil.findAndroidEventInRedisRequests(event, (err, res) => {
      resolve({ err, res });
    });
  });

  assertEvent(err, res, check);
};

const assertAndroidAutotrackHierarchy = async (
  expectedName,
  expectedHierarchy,
  expectedTargetText
) => {
  return assertAndroidEvent({
    envId: '2084764307',
    event: {
      custom: {
        name: expectedName,
        properties: {
          touchableHierarchy: {
            string: expectedHierarchy,
          },
          targetText: {
            string: expectedTargetText,
          },
        },
      },
    },
  });
};

assertAutotrackHierarchy = async (
  expectedName,
  expectedHierarchy,
  expectedTargetText
) => {
  if (device.getPlatform() === 'android') {
    return assertAndroidAutotrackHierarchy(
      expectedName,
      expectedHierarchy,
      expectedTargetText
    );
  } else if (device.getPlatform() === 'ios') {
    return assertIosPixel({
      t: expectedName,
      k: [
        'touchableHierarchy',
        expectedHierarchy,
        'targetText',
        expectedTargetText,
      ],
    });
  } else {
    throw new Error(`Unknown device type: ${device.getPlatform()}`);
  }
};

const doTestActions = async () => {
  await expect(element(by.id('track1'))).toBeVisible();
  await element(by.id('track1')).tap();
  await element(by.id('aep')).tap();
  await element(by.id('track2')).tap();
  await element(by.id('removeProp')).tap();
  await element(by.id('track3')).tap();
  await element(by.id('clearProps')).tap();
  await element(by.id('track4')).tap();
  await element(by.id('aup')).tap();
  await element(by.id('identify')).tap();
  await element(by.id('touchableOpacityText')).tap();
  await element(by.id('touchableHighlightText')).tap();
  await element(by.id('touchableWithoutFeedbackText')).tap();

  if (device.getPlatform() === 'android') {
    await element(by.id('touchableNativeFeedbackText')).tap();
  }
};

describe('ReactNative Support', () => {
  before(async () => {
    await device.launchApp();
  });

  before(done => {
    db.orm.connection.sharedRedis().flushall(done);
  });

  describe(':ios: Bridge API', () => {
    before(async () => {
      await doTestActions();
      // Heap iOS flushes events every 15 seconds. Wait 16 seconds to ensure that
      // all events are flushed to redis before asserting.
      // :TODO:(jmtaber129): Make this wait shorter if/when we expose setting the
      // flush frequency to the RN bridge.
      await new Promise(resolve => setTimeout(resolve, 16000));
    });

    it('should call first track', async () => {
      await assertIosPixel(
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
      await assertIosPixel(
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
      await assertIosPixel(
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
      await assertIosPixel(
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
      // Heap Android flushes events every 15 seconds. Wait 16 seconds to ensure that
      // all events are flushed to redis before asserting.
      // :TODO:(jmtaber129): Make this wait shorter if/when we expose setting the
      // flush frequency to the RN bridge.
      await new Promise(resolve => setTimeout(resolve, 16000));
    });

    it('should call first track', async () => {
      await assertAndroidEvent(
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

    it('should add event properties', async () => {
      await assertAndroidEvent(
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
      await assertAndroidEvent(
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
      await assertAndroidEvent(
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
        'AppContainer;|App;|Provider;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|Connect(TouchablesPage);|TouchablesPage;|TouchableOpacity;|';
      const expectedTargetText = 'Touchable Opacity Foo';
      await assertAutotrackHierarchy(
        'touchableHandlePress',
        expectedHierarchy,
        expectedTargetText
      );
    });

    it("should autotrack 'TouchableHighlight's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|Connect(TouchablesPage);|TouchablesPage;|TouchableHighlight;|';
      const expectedTargetText = 'Touchable Highlight';
      await assertAutotrackHierarchy(
        'touchableHandlePress',
        expectedHierarchy,
        expectedTargetText
      );
    });

    it("should autotrack 'TouchableWithoutFeedback's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|Connect(TouchablesPage);|TouchablesPage;|TouchableWithoutFeedback;|';
      const expectedTargetText = 'Touchable Without Feedback';
      await assertAutotrackHierarchy(
        'touchableHandlePress',
        expectedHierarchy,
        expectedTargetText
      );
    });

    it(":android: should autotrack 'TouchableNativeFeedback's", async () => {
      const expectedHierarchy =
        'AppContainer;|App;|Provider;|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;|SceneView;|Connect(TouchablesPage);|TouchablesPage;|TouchableNativeFeedback;|';
      const expectedTargetText = 'Touchable Native Feedback';
      await assertAutotrackHierarchy(
        'touchableHandlePress',
        expectedHierarchy,
        expectedTargetText
      );
    });
  });
});
