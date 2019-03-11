require('coffeescript').register();
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

waitForEventsToFlush = async () => {
  // Add a delay to wait for all events to flush to the server
  await new Promise(resolve => setTimeout(resolve, 16000));
};

pollForSentinel = async (sentinelValue, timeout = 60000) => {
  const startTick = Date.now();
  const event = { a: '2084764307', t: sentinelValue };

  while (Date.now() - startTick <= timeout) {
    // Try to find the event in the iOS style.
    const { iosErr, iosRes } = await new Promise((resolve, reject) => {
      testUtil.findEventInRedisRequests(event, (iosErr, iosRes) => {
        resolve({ iosErr, iosRes });
      });
    });

    if (iosRes.length != 0) {
      return;
    }

    // Try to find the event in the Android style.
    const { androidErr, androidRes } = await new Promise((resolve, reject) => {
      testUtil.findEventInRedisRequests(event, (androidErr, androidRes) => {
        resolve({ androidErr, androidRes });
      });
    });

    if (androidRes.length != 0) {
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  assert(false, `Timed out waiting for sentinel event ${sentinelValue}`);
};

module.exports = {
  assertEvent,
  assertIosPixel,
  assertAndroidEvent,
  assertAndroidAutotrackHierarchy,
  assertAutotrackHierarchy,
  waitForEventsToFlush,
  pollForSentinel,
};
