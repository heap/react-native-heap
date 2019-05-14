import { getCombinedInclusionList } from '../combineConfigs';
import { PropExtractorCriteria } from '../extractProps';
const deepFreeze = require('deep-freeze');

const makeTestCriteria = (include: string[], exclude: string[] | undefined) => {
  return deepFreeze({
    include,
    exclude,
  });
};

describe('The config combiner', () => {
  const criteria1: PropExtractorCriteria = makeTestCriteria(
    ['a', 'b', 'c'],
    []
  );
  const criteria2: PropExtractorCriteria = makeTestCriteria(['d', 'e'], ['a']);
  const criteria3: PropExtractorCriteria = makeTestCriteria(
    ['f', 'g'],
    ['d', 'b']
  );

  test('combines configs normally', () => {
    expect(getCombinedInclusionList([criteria1, criteria2, criteria3])).toEqual(
      ['c', 'e', 'f', 'g']
    );
  });

  test("doesn't include something previously excluded", () => {
    const criteria4: PropExtractorCriteria = makeTestCriteria(['a'], []);
    expect(getCombinedInclusionList([criteria2, criteria4])).toEqual([
      'd',
      'e',
    ]);
  });

  test('should be agnostic to input order', () => {
    const result1 = getCombinedInclusionList([criteria1, criteria2, criteria3]);
    const result2 = getCombinedInclusionList([criteria3, criteria2, criteria1]);

    expect(result1).toEqual(result2);
  });

  test('sorts the keys', () => {
    expect(getCombinedInclusionList([criteria2, criteria1])).toEqual([
      'b',
      'c',
      'd',
      'e',
    ]);
  });

  test('handles undefined exclusion lists', () => {
    const criteria4: PropExtractorCriteria = makeTestCriteria(
      ['h', 'i'],
      undefined
    );
    expect(getCombinedInclusionList([criteria2, criteria4])).toEqual([
      'd',
      'e',
      'h',
      'i',
    ]);
  });

  test('handles no inputs', () => {
    expect(getCombinedInclusionList([])).toEqual([]);
  });
});
