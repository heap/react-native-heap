/* global device */
/* global element */
/* global by */
/* global beforeAll */
/* global beforeEach */
/* global afterAll */

import assert from 'assert';
import {CaptureServer} from './server';
import {CaptureMessage, CaptureSourceEvent, getPropertyValue} from './types';

export function isAndroid(): boolean {
  return device.getPlatform() === 'android';
}
export function buttonText(text) {
  return isAndroid() ? text.toUpperCase() : text;
}

export function booleanValue(value) {
  return isAndroid() ? (value ? 'true' : 'false') : value;
}

export async function tapButton(text: string): Promise<string> {
  let renderedText = buttonText(text);
  await element(by.text(renderedText)).tap();
  return renderedText;
}

export async function tapNonButton(text: string): Promise<string> {
  await element(by.text(text)).tap();
  return text;
}

interface StandardTest {
  server: CaptureServer;
}

export function standardSetup(
  beforeEachBlock: () => Promise<void> = () => Promise.resolve(),
): StandardTest {
  let server = new CaptureServer();

  beforeAll(async () => {
    await device.launchApp();
    server.start(3000);
  });

  beforeEach(async () => {
    server.reset();
    await device.reloadReactNative();
    await beforeEachBlock();
  });

  afterAll(async () => {
    await server.stop();
  });

  return {server};
}

export function assertHierarchy(
  message: CaptureMessage<CaptureSourceEvent>,
  includes: string[],
  excludes: string[] = [],
) {
  let hierarchy = getPropertyValue(
    'rn_hierarchy',
    message.event.sourceEvent.sourceProperties,
  );
  assert.equal(typeof hierarchy, 'string');

  let split = hierarchy.toString().split('|');

  let index = 0;
  for (const part of includes) {
    let found = split.indexOf(part, index);
    assert.notEqual(
      found,
      -1,
      `Could not find ${part} in ${hierarchy} starting at index ${index}`,
    );
    index = found + 1;
  }

  for (const part of excludes) {
    assert.equal(
      split.indexOf(part),
      -1,
      `Found unexpected ${part} in ${hierarchy}`,
    );
  }
}

export async function tapSentinelButtonAndWait(
  text: string,
  currentScreenName: string,
  server: CaptureServer,
): Promise<CaptureMessage<CaptureSourceEvent>> {
  let target_text = await tapButton(text);
  return await server.expectSourceEventWithProperties('touch', {
    target_text,
    screen_name: currentScreenName,
  });
}
