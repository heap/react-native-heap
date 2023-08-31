/* global describe */
/* global it */
/* global element */
/* global by */
import {
  assertHierarchy,
  standardSetup,
  tapButton,
  tapNonButton,
} from './util/util';

describe('View hierarchies', () => {
  let tools = standardSetup(async () => {
    await tapButton('Touchables');
  });

  it('should work for <Button> tap', async () => {
    let target_text = await tapButton('Press me');

    let message = await tools.server.expectSourceEventWithProperties('touch', {
      target_text,
      screen_path: 'Touchables',
      screen_name: 'Touchables',
    });

    assertHierarchy(message, [
      '@TouchablesScreen;',
      '@ScrollView;',
      '@Button;[title=Press me];',
    ]);
  });

  it('should work for <TouchableOpacity> tap', async () => {
    let target_text = await tapNonButton('Touchable Opacity');

    let message = await tools.server.expectSourceEventWithProperties('touch', {
      target_text,
      screen_path: 'Touchables',
      screen_name: 'Touchables',
    });

    assertHierarchy(message, [
      '@TouchablesScreen;',
      '@ScrollView;',
      '@TouchableOpacity;',
    ]);
  });

  it('should work for <Pressable> tap', async () => {
    let target_text = await tapNonButton('Pressable');

    let message = await tools.server.expectSourceEventWithProperties('touch', {
      target_text,
      screen_path: 'Touchables',
      screen_name: 'Touchables',
    });

    assertHierarchy(message, [
      '@TouchablesScreen;',
      '@ScrollView;',
      '@Pressable;',
    ]);
  });

  it('should work for <TextInput> edit', async () => {
    await tapButton('focus textinput');
    await element(by.id('myTextInput')).typeText('foo ');
    await tapNonButton('Pressable'); // Unfocus text field

    let message = await tools.server.expectSourceEventWithProperties(
      'text_edit',
      {
        screen_path: 'Touchables',
        screen_name: 'Touchables',
      },
    );

    assertHierarchy(message, [
      '@TouchablesScreen;',
      '@ScrollView;',
      '@MyTextInput;',
      '@TextInput;[testID=myTextInput];',
    ]);
  });

  it('should work for <Switch> change', async () => {
    await element(by.id('my-switch')).tap();

    let message = await tools.server.expectSourceEventWithProperties('change', {
      screen_path: 'Touchables',
      screen_name: 'Touchables',
    });

    assertHierarchy(message, [
      '@TouchablesScreen;',
      '@ScrollView;',
      '@Switch;[testID=my-switch];',
    ]);
  });
});
