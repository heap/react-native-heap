import { transformFileSync } from '@babel/core';
import path from 'path';
import fs from 'fs';
import * as assert from 'should/as-function';

import instrumentorPlugin from '../src/index';

describe('autotrack instrumentor plugin', () => {
  it('touchable should be instrumented', () => {
    var actual = getActualTransformedFile('is-touchable');
    var expected = getExpectedTransformedFile('is-touchable');
    assert.equal(actual, expected);
  });

  it('class without Touchable.mixin should not be instrumented', () => {
    var actual = getActualTransformedFile('no-touchable-mixin');
    var expected = getExpectedTransformedFile('no-touchable-mixin');
    assert.equal(actual, expected);
  });

  it('object without createReactClass should not be instrumented', () => {
    var actual = getActualTransformedFile('not-create-react-class');
    var expected = getExpectedTransformedFile('not-create-react-class');
    assert.equal(actual, expected);
  });

  it('touchable with no press handlers should be unchanged', () => {
    var actual = getActualTransformedFile('touchable-no-press-handlers');
    var expected = getExpectedTransformedFile('touchable-no-press-handlers');
    assert.equal(actual, expected);
  });

  it('instruments the runApplication method of AppRegistry', () => {
    var actual = getActualTransformedFile('run-application');
    var expected = getExpectedTransformedFile('run-application');
    assert.equal(actual, expected);
  });

  it('switch should be instrumented', () => {
    var actual = getActualTransformedFile('is-switch');
    var expected = getExpectedTransformedFile('is-switch');
    assert.equal(actual, expected);
  });

  it('scrollview with createReactClass should be instrumented', () => {
    var actual = getActualTransformedFile('is-scroll-view-createreactclass');
    var expected = getExpectedTransformedFile('is-scroll-view-createreactclass');
    assert.equal(actual, expected);
  });

  it('scrollview extending React.Component should be instrumented', () => {
    var actual = getActualTransformedFile('is-scroll-view-extends-component');
    var expected = getExpectedTransformedFile('is-scroll-view-extends-component');
    assert.equal(actual, expected);
  });

  it('non-scrollview should not be instrumented', () => {
    var actual = getActualTransformedFile('not-scroll-view');
    var expected = getExpectedTransformedFile('not-scroll-view');
    assert.equal(actual, expected);
  });

  it('textinput should be instrumented', () => {
    var actual = getActualTransformedFile('is-text-input');
    var expected = getExpectedTransformedFile('is-text-input');
    assert.equal(actual, expected);
  });

  it('non-textinput should not be instrumented', () => {
    var actual = getActualTransformedFile('not-text-input');
    var expected = getExpectedTransformedFile('not-text-input');
    assert.equal(actual, expected);
  });

  it('touchables on RN 0.62+ should be instrumented', () => {
    var actual = getActualTransformedFile('is-touchable-0-62');
    var expected = getExpectedTransformedFile('is-touchable-0-62');
    assert.equal(actual, expected);
  });

  it('functional textinput should be instrumented with HOC', () => {
    var actual = getActualTransformedFile('is-functional-textinput');
    var expected = getExpectedTransformedFile('is-functional-textinput');
    assert.equal(actual, expected);
  });

  it('function declarations without ID field should not crash instrumentor', () => {
    var actual = getActualTransformedFile('is-function-declaration-no-id');
    var expected = getExpectedTransformedFile('is-function-declaration-no-id');
    assert.equal(actual, expected);
  });

  it('pressable components should be instrumented', () => {
    var actual = getActualTransformedFile('is-pressable');
    var expected = getExpectedTransformedFile('is-pressable');
    assert.equal(actual, expected);
  });
});

const getActualTransformedFile = fixtureName => {
  return transformFileSync(
    path.join(__dirname, 'fixtures', fixtureName, 'code.js'),
    {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [instrumentorPlugin],
      compact: false,
    }
  ).code;
};

const getExpectedTransformedFile = fixtureName => {
  return fs
    .readFileSync(
      path.join(__dirname, 'fixtures', fixtureName, 'output.js'),
      'utf8'
    )
    .trim();
};
