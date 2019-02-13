import * as _ from 'lodash';

import { Component, extractProps, PropExtractorConfig } from '../extractProps';

describe('Extracting Props with a configuration', () => {
  const obj1: Component = {
    props: {
      a: 'foo',
      b: 7,
      c: true,
    },
  };

  const objWithEventProps: Component = {
    props: obj1.props,
    heapOptions: {
      eventProps: {
        include: ['b'],
      },
    },
  };

  const config: PropExtractorConfig = {
    Element: {
      include: ['a', 'c'],
      exclude: [],
    },
  };

  test("can omit keys that weren't specified", () => {
    expect(extractProps('Element', obj1, config)).toEqual('[a=foo];[c=true];');
  });

  test('can output all primitives', () => {
    const config2 = _.merge({}, config, {
      Element: { include: ['a', 'b', 'c'] },
    });
    expect(extractProps('Element', obj1, config2)).toEqual(
      '[a=foo];[b=7];[c=true];'
    );
  });

  test('skips if component is not in config', () => {
    expect(extractProps('OtherElement', obj1, config)).toEqual('');
  });

  test('can handle a null component', () => {
    expect(extractProps('Element', null, config)).toEqual('');
  });

  test('can handle if a prop is null or undefined', () => {
    const obj2 = _.merge({}, obj1, { props: { c: null } });
    expect(extractProps('Element', obj2, config)).toEqual('[a=foo];');

    const config2 = _.merge({}, config, { Obj1: { include: ['a', 'c', 'd'] } });
    expect(extractProps('Element', obj1, config2)).toEqual('[a=foo];[c=true];');
  });

  test("functions don't come through", () => {
    const obj2 = _.merge({}, obj1, {
      props: {
        a: () => {
          console.log('hi!');
        },
      },
    });
    expect(extractProps('Element', obj2, config)).toEqual('[c=true];');
  });

  test('nested objects flatten properly', () => {
    const obj2 = _.merge({}, obj1, {
      props: {
        a: {
          innerKey: 'kwikset',
        },
      },
    });

    expect(extractProps('Element', obj2, config)).toEqual(
      '[a.innerKey=kwikset];[c=true];'
    );
  });

  test('arrays flatten properly', () => {
    const obj2 = _.merge({}, obj1, {
      props: {
        a: [3, 4, 5],
      },
    });

    expect(extractProps('Element', obj2, config)).toEqual(
      '[a.0=3];[a.1=4];[a.2=5];[c=true];'
    );
  });

  test('removes any brackets in a prop', () => {
    const obj2 = _.merge({}, obj1, {
      props: {
        a: 'bracket][bracket][bracket]',
      },
    });

    expect(extractProps('Element', obj2, config)).toEqual(
      '[a=bracketbracketbracket];[c=true];'
    );
  });

  test('extracts class configurations', () => {
    expect(extractProps('Element', objWithEventProps, config)).toEqual(
      '[a=foo];[b=7];[c=true];'
    );
  });

  test('Can handle a heapOptions without an eventProps', () => {
    const objWithEventProps2 = {
      ...objWithEventProps,
      heapOptions: {},
    };

    expect(extractProps('Element', objWithEventProps2, config)).toEqual(
      '[a=foo];[c=true];'
    );
  });
});
