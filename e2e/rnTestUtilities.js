require('coffeescript').register();
db = require('../../heap/back/db');
testUtil = require('../../heap/test/util');

const HEAP_ENV_ID = '2084764307';

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
    envId: HEAP_ENV_ID,
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

const assertAutotrackHierarchy = async (
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

const assertAndroidNavigationEvent = async (expectedPath, expectedType) => {
  const commonProps = {
    path: {
      string: expectedPath,
    },
  };
  const props = expectedType
    ? {
        ...commonProps,
        type: {
          string: expectedType,
        },
      }
    : commonProps;

  return assertAndroidEvent({
    envId: HEAP_ENV_ID,
    event: {
      custom: {
        name: 'reactNavigationScreenview',
        properties: props,
      },
    },
  });
};

const assertIosNavigationEvent = async (expectedPath, expectedType) => {
  const commonProps = ['path', expectedPath];
  const props = expectedType
    ? [...commonProps, 'type', expectedType]
    : commonProps;
  return assertIosPixel({
    t: 'reactNavigationScreenview',
    k: props,
  });
};

const assertNavigationEvent = async (expectedPath, expectedType) => {
  if (device.getPlatform() === 'android') {
    return assertAndroidNavigationEvent(expectedPath, expectedType);
  } else if (device.getPlatform() === 'ios') {
    return assertIosNavigationEvent(expectedPath, expectedType);
  } else {
    throw new Error(`Unknown device type: ${device.getPlatform()}`);
  }
};

pollForSentinel = async (sentinelValue, timeout = 60000) => {
  console.log(
    `--- Waiting for ${sentinelValue} sentinel event.  This will timeout in 60s ---`
  );
  const startTick = Date.now();

  // Give it a few seconds at first.
  await new Promise(resolve => setTimeout(resolve, 3000));

  while (Date.now() - startTick <= timeout) {
    const eventName = `${sentinelValue.toUpperCase()}_SENTINEL`;
    if (device.getPlatform() === 'ios') {
      const event = {
        a: HEAP_ENV_ID,
        t: eventName,
      };

      const { iosErr, iosRes } = await new Promise((resolve, reject) => {
        testUtil.findEventInRedisRequests(event, (iosErr, iosRes) => {
          resolve({ iosErr, iosRes });
        });
      });

      if (iosRes.length != 0) {
        return;
      }
    } else if (device.getPlatform() === 'android') {
      const event = {
        envId: HEAP_ENV_ID,
        event: {
          custom: {
            name: eventName,
          },
        },
      };

      const { androidErr, androidRes } = await new Promise(
        (resolve, reject) => {
          testUtil.findAndroidEventInRedisRequests(
            event,
            (androidErr, androidRes) => {
              resolve({ androidErr, androidRes });
            }
          );
        }
      );

      if (androidRes.length != 0) {
        return;
      }
    } else {
      throw new Error(`Unknown device type: ${device.getPlatform()}`);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  throw new Error(`Timed out waiting for sentinel event ${sentinelValue}`);
};

module.exports = {
  assertEvent,
  assertIosPixel,
  assertAndroidEvent,
  assertAndroidAutotrackHierarchy,
  assertAutotrackHierarchy,
  assertNavigationEvent,
  pollForSentinel,
};
