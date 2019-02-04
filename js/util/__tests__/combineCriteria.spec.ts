import { getCombinedCriteria } from '../combineCriteria';
import { PropExtractorConfig } from '../extractProps';
const deepFreeze = require('deep-freeze');

const makeTestConfig = (include, exclude) => {
  return deepFreeze({
    FooClass: {
      include: include,
      exclude: exclude,
    },
  });
};

describe('The criteriaCache', () => {
  const config1: PropExtractorConfig = makeTestConfig(['a', 'b', 'c'], []);
  const config2: PropExtractorConfig = makeTestConfig(['d', 'e'], ['a']);
  const config3: PropExtractorConfig = makeTestConfig(['f', 'g'], ['d', 'b']);

  test('combines configs normally', () => {
    expect(
      getCombinedCriteria('FooClass', [config1, config2, config3])
    ).toEqual({
      include: ['c', 'e', 'f', 'g'],
    });
  });

  test('sorts the keys', () => {
    expect(getCombinedCriteria('FooClass', [config2, config1])).toEqual({
      include: ['a', 'b', 'c', 'd', 'e'],
    });
  });

  test('handles undefined exclusion lists', () => {
    const config4: PropExtractorConfig = makeTestConfig(['h', 'i'], undefined);
    expect(getCombinedCriteria('FooClass', [config2, config4])).toEqual({
      include: ['d', 'e', 'h', 'i'],
    });
  });

  test('handles no inputs', () => {
    expect(getCombinedCriteria('FooClass', [])).toEqual({ include: [] });
  });
});
