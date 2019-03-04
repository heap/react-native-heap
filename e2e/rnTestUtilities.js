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

module.exports = {
  assertEvent,
  assertIosPixel,
  assertAndroidEvent,
  assertAndroidAutotrackHierarchy,
};
