require('coffeescript').register();
_ = require('lodash');
assert = require('should/as-function');

nodeUtil = require('util');
testUtil = require('../../heap/test/util');
rnTestUtil = require('./rnTestUtilities');

const BASICS_PAGE_TOP_HIERARCHY =
  'AppContainer;|App;|Provider;|withReactNavigationAutotrack(NavigationContainer);|NavigationContainer;|Navigator;|NavigationView;|TabNavigationView;|ScreenContainer;|ResourceSavingScene;[key=Basics];|SceneView;|Connect(BasicsPage);|BasicsPage;|ScrollView;[testID=scrollContainer];|';

const doTestActions = async () => {
  // Open the Basics tab in the tab navigator.
  await element(by.id('Basics')).tap();

  await expect(element(by.id('track1'))).toBeVisible();
  await element(by.id('track1')).tap();
  await element(by.id('aep')).tap();
  await element(by.id('track2')).tap();

  await rnTestUtil.waitIfIos();

  await element(by.id('removeProp')).tap();
  await element(by.id('track3')).tap();
  await element(by.id('clearProps')).tap();

  await rnTestUtil.waitIfIos();

  await element(by.id('track4')).tap();
  await element(by.id('aup')).tap();
  await element(by.id('identify')).tap();

  await rnTestUtil.waitIfIos();

  await element(by.id('touchableOpacityText')).tap();
  await element(by.id('touchableHighlightText')).tap();
  await element(by.id('touchableWithoutFeedbackText')).tap();

  if (device.getPlatform() === 'android') {
    await element(by.id('touchableNativeFeedbackText')).tap();
  }

  await rnTestUtil.waitIfIos();

  await element(by.id('switch')).tap();
  await element(by.id('nbSwitch')).tap();

  await rnTestUtil.waitIfIos();

  await element(by.id('textInput')).typeText('foo ');
  await element(by.id('textInput')).tapReturnKey();

  await expect(element(by.id('resetIdentity'))).toBeVisible();
  await element(by.id('resetIdentity')).tap();

  await rnTestUtil.waitIfIos();

  await waitFor(element(by.id('basicsSentinel')))
    .toBeVisible()
    .whileElement(by.id('scrollContainer'))
    .scroll(200, 'down');

  await element(by.id('scrollView')).swipe('left');
  await element(by.id('basicsSentinel')).tap();
};

describe('Basic React Native and Interaction Support', () => {
  before(async () => {
    await rnTestUtil.flushAllRedis();
    await doTestActions();
    await rnTestUtil.pollForSentinel('Basics');
  });

  describe(':ios: Bridge API', () => {
    it('should call first track', async () => {
      await rnTestUtil.assertIosPixel(
        {
          a: '2084764307',
          t: 'pressInTestEvent1',
          sprops: ['path', 'Basics', 'screen_name', 'Basics'],
        },
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
        {
          a: '2084764307',
          t: 'pressInTestEvent2',
          sprops: ['path', 'Basics', 'screen_name', 'Basics'],
        },
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
        {
          a: '2084764307',
          t: 'pressInTestEvent3',
          sprops: ['path', 'Basics', 'screen_name', 'Basics'],
        },
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
        {
          a: '2084764307',
          t: 'pressInTestEvent4',
          sprops: ['path', 'Basics', 'screen_name', 'Basics'],
        },
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

    it('should reset identity', async () => {
      const { err1, err2, res1, res2 } = await new Promise(resolve => {
        // Fetch a pre-resetIdentity event.
        testUtil.findEventInRedisRequests(
          { t: 'pressInTestEvent2' },
          (err1, res1) => {
            // Fetch a post-resetIdentity event.
            testUtil.findEventInRedisRequests(
              { t: 'BASICS_SENTINEL' },
              (err2, res2) => {
                resolve({ err1, err2, res1, res2 });
              }
            );
          }
        );
      });

      assert.not.exist(err1);
      assert.not.exist(err2);
      assert(res1.length).not.equal(0);
      assert(res2.length).not.equal(0);

      // Assert that there is no identity post-resetIdentity, and that the post-resetIdentity user ID is different from the
      // pre-resetIdentity user ID.
      assert.not.exist(res2[0]['i']);
      assert(res1[0]['u']).not.equal(res2[0]['u']);
    });
  });

  describe(':android: Bridge API', () => {
    it('should call first track', async () => {
      await rnTestUtil.assertAndroidEvent(
        {
          envId: '2084764307',
          event: {
            sourceCustomEvent: {
              name: 'pressInTestEvent1',
              sourceName: 'react_native',
            },
          },
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
      const findAndroidEvent = nodeUtil.promisify(
        testUtil.findAndroidEventInRedisRequests
      );

      const [[event1], [event2]] = await Promise.all([
        findAndroidEvent({
          envId: '2084764307',
          event: {
            sourceCustomEvent: {
              name: 'pressInTestEvent1',
              sourceName: 'react_native',
            },
          },
        }),
        findAndroidEvent({
          envId: '2084764307',
          event: {
            sourceCustomEvent: {
              name: 'pressInTestEvent2',
              sourceName: 'react_native',
            },
          },
        }),
      ]);

      assert(event1.sessionInfo.id).equal(event2.sessionInfo.id);
    });

    it('should add event properties', async () => {
      await rnTestUtil.assertAndroidEvent(
        {
          envId: '2084764307',
          event: {
            sourceCustomEvent: {
              name: 'pressInTestEvent2',
              sourceName: 'react_native',
            },
          },
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
          event: {
            sourceCustomEvent: {
              name: 'pressInTestEvent3',
              sourceName: 'react_native',
            },
          },
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
          event: {
            sourceCustomEvent: {
              name: 'pressInTestEvent4',
              sourceName: 'react_native',
            },
          },
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

    it('should reset identity', async () => {
      const { err1, err2, res1, res2 } = await new Promise(resolve => {
        // Fetch a pre-resetIdentity event.
        testUtil.findAndroidEventInRedisRequests(
          {
            event: {
              sourceCustomEvent: {
                name: 'pressInTestEvent2',
                sourceName: 'react_native',
              },
            },
          },
          (err1, res1) => {
            // Fetch a post-resetIdentity event.
            testUtil.findAndroidEventInRedisRequests(
              { event: { sourceCustomEvent: { name: 'BASICS_SENTINEL' } } },
              (err2, res2) => {
                resolve({ err1, err2, res1, res2 });
              }
            );
          }
        );
      });

      assert.not.exist(err1);
      assert.not.exist(err2);
      assert(res1.length).not.equal(0);
      assert(res2.length).not.equal(0);

      // Assert that there is no identity post-resetIdentity, and that the post-resetIdentity user ID is different from the
      // pre-resetIdentity user ID.
      assert.not.exist(res2[0]['user']['identity']);
      assert(res1[0]['user']['id']).not.equal(res2[0]['user']['id']);
    });
  });

  describe('Autotrack', () => {
    it("should autotrack 'TouchableOpacity's", async () => {
      const expectedHierarchy = `${BASICS_PAGE_TOP_HIERARCHY}TouchableOpacity;[testID=touchableOpacityText];|`;
      const expectedTargetText = 'Touchable Opacity Foo';
      await rnTestUtil.assertAutotrackHierarchy('touch', {
        hierarchy: expectedHierarchy,
        target_text: expectedTargetText,
        screen_name: 'Basics',
        path: 'Basics',
      });
    });

    it("should autotrack 'TouchableHighlight's", async () => {
      const expectedHierarchy = `${BASICS_PAGE_TOP_HIERARCHY}TouchableHighlight;[testID=touchableHighlightText];|`;
      const expectedTargetText = 'Touchable Highlight';
      await rnTestUtil.assertAutotrackHierarchy('touch', {
        hierarchy: expectedHierarchy,
        target_text: expectedTargetText,
        screen_name: 'Basics',
        path: 'Basics',
      });
    });

    it("should autotrack 'TouchableWithoutFeedback's", async () => {
      const expectedHierarchy = `${BASICS_PAGE_TOP_HIERARCHY}TouchableWithoutFeedback;[testID=touchableWithoutFeedbackText];|`;
      const expectedTargetText = 'Touchable Without Feedback';
      await rnTestUtil.assertAutotrackHierarchy('touch', {
        hierarchy: expectedHierarchy,
        target_text: expectedTargetText,
        screen_name: 'Basics',
        path: 'Basics',
      });
    });

    it(":android: should autotrack 'TouchableNativeFeedback's", async () => {
      const expectedHierarchy = `${BASICS_PAGE_TOP_HIERARCHY}TouchableNativeFeedback;[testID=touchableNativeFeedbackText];|`;
      const expectedTargetText = 'Touchable Native Feedback';
      await rnTestUtil.assertAutotrackHierarchy('touch', {
        hierarchy: expectedHierarchy,
        target_text: expectedTargetText,
        screen_name: 'Basics',
        path: 'Basics',
      });
    });

    it("should autotrack 'Switch's", async () => {
      const expectedHierarchy = `${BASICS_PAGE_TOP_HIERARCHY}Switch;[testID=switch];|`;
      await rnTestUtil.assertAutotrackHierarchy('change', {
        hierarchy: expectedHierarchy,
        screen_name: 'Basics',
        path: 'Basics',
      });
    });

    it("should autotrack NativeBase 'Switch's", async () => {
      const expectedHierarchy = `${BASICS_PAGE_TOP_HIERARCHY}StyledComponent;[testID=nbSwitch];|Switch;[testID=nbSwitch];|Switch;[testID=nbSwitch];|`;
      await rnTestUtil.assertAutotrackHierarchy('change', {
        hierarchy: expectedHierarchy,
        screen_name: 'Basics',
        path: 'Basics',
      });
    });

    it('should autotrack ScrollView paging', async () => {
      const expectedHierarchy = `${BASICS_PAGE_TOP_HIERARCHY}FlatList;[testID=scrollView];|VirtualizedList;[testID=scrollView];|ScrollView;[testID=scrollView];|`;
      await rnTestUtil.assertAutotrackHierarchy('scroll_view_page', {
        hierarchy: expectedHierarchy,
        page_index: '1',
        screen_name: 'Basics',
        path: 'Basics',
      });
    });

    it('should autotrack TextInput edits', async () => {
      const expectedHierarchy = `${BASICS_PAGE_TOP_HIERARCHY}MyTextInput;[testID=textInput];|TextInput;[testID=textInput];|`;
      await rnTestUtil.assertAutotrackHierarchy('text_edit', {
        hierarchy: expectedHierarchy,
        placeholder_text: 'foo placeholder',
        screen_name: 'Basics',
        path: 'Basics',
      });
    });
  });
});
