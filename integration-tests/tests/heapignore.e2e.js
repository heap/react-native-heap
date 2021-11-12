/* global describe */
/* global it */
/* global element */
/* global by */
import assert from 'assert';
import {getPropertyValue} from './util/types';
import {
  assertHierarchy,
  standardSetup,
  tapButton,
  tapSentinelButtonAndWait,
} from './util/util';

describe('HeapIgnore', () => {
  let tools = standardSetup(async () => {
    await tapButton('HeapIgnore');
  });

  it('should omit <HeapIgnore>...</HeapIgnore> touches', async () => {
    await element(by.id('totallyIgnored')).tap();
    await tapSentinelButtonAndWait('Sentinel', 'HeapIgnore', tools.server);

    tools.server.assertNoExistingSourceEventWithProperties('touch', {
      target_text: 'Foobar',
      screen_name: 'HeapIgnore',
    });
  });

  it('should omit `Heap.withHeapIgnore` touches', async () => {
    await element(by.id('totallyIgnoredHoc')).tap();
    await tapSentinelButtonAndWait('Sentinel', 'HeapIgnore', tools.server);

    tools.server.assertNoExistingSourceEventWithProperties('touch', {
      target_text: 'Foobar',
      screen_name: 'HeapIgnore',
    });
  });

  it('should omit text from `Heap.withHeapIgnore{allowTargetText:false}` touches but include everything else', async () => {
    await element(by.id('allowedAllPropsHoc')).tap();

    const message = await tools.server.expectSourceEventWithProperties(
      'touch',
      {
        screen_name: 'HeapIgnore',
      },
    );

    assert.equal(
      getPropertyValue(
        'target_text',
        message.event.sourceEvent.sourceProperties,
      ),
      undefined,
      'target_text should not have been set',
    );

    assertHierarchy(message, [
      '@HeapIgnoreScreen;',
      // '@withHeapIgnore(Component);[testID=allowedAllPropsHoc];', // Different RN versions resolve (Component) differently.
      '@HeapIgnore;',
      '@TouchableOpacity;[testID=allowedAllPropsHoc];',
    ]);
  });

  it('should omit text, properties, and inner hierarchy from `<HeapIgnore allowInteraction={true}>` touches', async () => {
    await element(by.id('allowedInteraction')).tap();

    const message = await tools.server.expectSourceEventWithProperties(
      'touch',
      {
        screen_name: 'HeapIgnore',
      },
    );

    assert.equal(
      getPropertyValue(
        'target_text',
        message.event.sourceEvent.sourceProperties,
      ),
      undefined,
      'target_text should not have been set',
    );

    assertHierarchy(
      message,
      ['@HeapIgnoreScreen;', '@HeapIgnore;'],
      ['@TouchableOpacity;[testID=allowedAllPropsHoc];', '@TouchableOpacity;'],
    );
  });

  it('should omit text and properties from `<HeapIgnore allowInteraction={true} allowInnerHierarchy={true}>` touches', async () => {
    await element(by.id('allowedInnerHierarchy')).tap();

    const message = await tools.server.expectSourceEventWithProperties(
      'touch',
      {
        screen_name: 'HeapIgnore',
      },
    );

    assert.equal(
      getPropertyValue(
        'target_text',
        message.event.sourceEvent.sourceProperties,
      ),
      undefined,
      'target_text should not have been set',
    );

    assertHierarchy(
      message,
      ['@HeapIgnoreScreen;', '@HeapIgnore;', '@TouchableOpacity;'],
      ['@TouchableOpacity;[testID=allowedInnerHierarchy];'],
    );
  });

  it('should omit text only from `<HeapIgnore allowInteraction={true} allowInnerHierarchy={true} allowAllProps={true}>` touches', async () => {
    await element(by.id('allowedAllProps')).tap();

    const message = await tools.server.expectSourceEventWithProperties(
      'touch',
      {
        screen_name: 'HeapIgnore',
      },
    );

    assert.equal(
      getPropertyValue(
        'target_text',
        message.event.sourceEvent.sourceProperties,
      ),
      undefined,
      'target_text should not have been set',
    );

    assertHierarchy(message, [
      '@HeapIgnoreScreen;',
      '@HeapIgnore;',
      '@TouchableOpacity;[testID=allowedAllProps];',
    ]);
  });

  it('should omit only properties from `<HeapIgnore allowInteraction={true} allowInnerHierarchy={true} allowTargetText={true}>` touches', async () => {
    await element(by.id('allowedTargetText')).tap();

    const message = await tools.server.expectSourceEventWithProperties(
      'touch',
      {
        target_text: 'Foobar',
        screen_name: 'HeapIgnore',
      },
    );

    assertHierarchy(
      message,
      ['@HeapIgnoreScreen;', '@HeapIgnore;', '@TouchableOpacity;'],
      ['@TouchableOpacity;[testID=allowedTargetText];'],
    );
  });

  it('should omit text only from `<HeapIgnoreTargetText>` touches', async () => {
    await element(by.id('ignoredTargetText')).tap();

    const message = await tools.server.expectSourceEventWithProperties(
      'touch',
      {
        screen_name: 'HeapIgnore',
      },
    );

    assert.equal(
      getPropertyValue(
        'target_text',
        message.event.sourceEvent.sourceProperties,
      ),
      undefined,
      'target_text should not have been set',
    );

    assertHierarchy(message, [
      '@HeapIgnoreScreen;',
      '@HeapIgnore;',
      '@TouchableOpacity;[testID=ignoredTargetText];',
    ]);
  });
});
