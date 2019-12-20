import * as _ from 'lodash';

import { FiberNode, extractProps, PropExtractorConfig } from '../extractProps';

describe('Extracting Props with a configuration', () => {
  const obj1: FiberNode = {
    stateNode: {
      props: {
        a: 'foo',
        b: 7,
        c: true,
      },
    },
  };

  const objWithEventProps: FiberNode = {
    stateNode: {
      props: obj1.stateNode!.props,
      heapOptions: {
        eventProps: {
          include: ['b'],
        },
      },
    },
  };

  const objWithNestedObject = _.merge({}, obj1, {
    stateNode: {
      props: {
        a: {
          innerKey: 'kwikset',
          innerNumber: 42,
        },
        b: {
          c: {
            bar: 'asdf',
            foo: 'fdsa',
          },
        },
      },
    },
  });

  const objectWithNestedArray = _.merge({}, obj1, {
    stateNode: {
      props: {
        a: [3, 4, 5],
      },
    },
  });

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

  test('can handle a null fiberNode', () => {
    expect(extractProps('Element', null, config)).toEqual('');
  });

  test('can handle if a prop is null or undefined', () => {
    const obj2 = _.merge({}, obj1, { stateNode: { props: { c: null } } });
    expect(extractProps('Element', obj2, config)).toEqual('[a=foo];');

    const config2 = _.merge({}, config, { Obj1: { include: ['a', 'c', 'd'] } });
    expect(extractProps('Element', obj1, config2)).toEqual('[a=foo];[c=true];');
  });

  test('can handle if a prop has a circular ref', () => {
    const myProp: { foo?: any } = {};
    myProp.foo = myProp;
    const obj2 = _.merge({}, obj1, { stateNode: { props: { c: myProp } } });
    expect(extractProps('Element', obj2, config)).toEqual(
      '[a=foo];[c.foo.foo.foo=object Object];'
    );
  });

  test("functions don't come through", () => {
    const obj2 = _.merge({}, obj1, {
      stateNode: {
        props: {
          a: () => {
            console.log('hi!');
          },
        },
      },
    });
    expect(extractProps('Element', obj2, config)).toEqual('[c=true];');
  });

  test('nested objects flatten properly', () => {
    expect(extractProps('Element', objWithNestedObject, config)).toEqual(
      '[a.innerKey=kwikset];[a.innerNumber=42];[c=true];'
    );
  });

  test('can extract an attribute of a nested object', () => {
    const config2 = _.merge({}, config, {
      Element: { include: ['a.innerKey', 'b.c', 'c'] },
    });

    expect(extractProps('Element', objWithNestedObject, config2)).toEqual(
      '[a.innerKey=kwikset];[b.c.bar=asdf];[b.c.foo=fdsa];[c=true];'
    );
  });

  test('arrays flatten properly', () => {
    expect(extractProps('Element', objectWithNestedArray, config)).toEqual(
      '[a.0=3];[a.1=4];[a.2=5];[c=true];'
    );
  });

  test('can extract a single element of an array', () => {
    const config2 = _.merge({}, config, {
      Element: { include: ['a.1'] },
    });

    expect(extractProps('Element', objectWithNestedArray, config2)).toEqual(
      '[a.1=4];[c=true];'
    );
  });

  test('removes any reserved characters in a prop', () => {
    const obj2 = _.merge({}, obj1, {
      stateNode: {
        props: {
          a: 'bracket]@[|=#;;bracket][bracket]',
        },
      },
    });

    expect(extractProps('Element', obj2, config)).toEqual(
      '[a=bracketbracketbracket];[c=true];'
    );
  });

  test('removes any props with keys containing reserved characters', () => {
    const obj2 = _.merge({}, obj1, {
      stateNode: {
        props: {
          'abc@;|=#': 'foo',
        },
      },
    });

    const config2 = _.merge({}, config, {
      Element: { include: ['a', 'abc@;|=#'] },
    });

    expect(extractProps('Element', obj2, config2)).toEqual('[a=foo];');
  });

  test('extracts class configurations', () => {
    expect(extractProps('Element', objWithEventProps, config)).toEqual(
      '[a=foo];[b=7];[c=true];'
    );
  });

  test('Can handle a heapOptions without an eventProps', () => {
    const objWithEventProps2 = {
      stateNode: {
        props: obj1.stateNode!.props,
        heapOptions: {},
      },
    };

    expect(extractProps('Element', objWithEventProps2, config)).toEqual(
      '[a=foo];[c=true];'
    );
  });

  test('uses memoizedProps when stateNode is null', () => {
    const objNoStateNode = {
      memoizedProps: obj1.stateNode!.props,
    };

    expect(extractProps('Element', objNoStateNode, config)).toEqual(
      '[a=foo];[c=true];'
    );
  });

  test('uses type.heapOptions when there is no stateNode', () => {
    const objNoStateNodePropConfig = {
      memoizedProps: obj1.stateNode!.props,
      type: {
        heapOptions: objWithEventProps.stateNode!.heapOptions,
      },
    };

    expect(extractProps('Element', objNoStateNodePropConfig, config)).toEqual(
      '[a=foo];[b=7];[c=true];'
    );
  });

  test('uses stateNode.heapOptions and not type.heapOptions if stateNode exists', () => {
    const objMultipleHeapOptions = {
      stateNode: {
        props: obj1.stateNode!.props,
      },
      type: {
        // This should be ignored, since the 'stateNode' exists.
        heapOptions: objWithEventProps.stateNode!.heapOptions,
      },
    };

    expect(extractProps('Element', objMultipleHeapOptions, config)).toEqual(
      '[a=foo];[c=true];'
    );
  });
});
