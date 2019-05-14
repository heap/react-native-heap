import { PropExtractorCriteria } from './extractProps';

// Borrowed from http://2ality.com/2015/01/es6-set-operations.html .
const union = <T>(s1: Set<T>, s2: Set<T>) => new Set([...s1, ...s2]);
const difference = <T>(s1: Set<T>, s2: Set<T>) =>
  new Set([...s1].filter(x => !s2.has(x)));

export const getCombinedInclusionList = (
  criteriaList: PropExtractorCriteria[]
): string[] => {
  let inclusionSet = new Set<string>();
  let exclusionSet = new Set<string>();

  for (const criteria of criteriaList) {
    const configInclusionSet = new Set<string>();
    const configExclusionSet = new Set<string>();
    criteria.include.forEach(s => configInclusionSet.add(s));
    if (criteria.exclude) {
      criteria.exclude.forEach(s => configExclusionSet.add(s));
    }

    inclusionSet = union(inclusionSet, configInclusionSet);
    exclusionSet = union(exclusionSet, configExclusionSet);
  }

  inclusionSet = difference(inclusionSet, exclusionSet);

  // Sorting here so that the order is consistent across calls.
  return [...inclusionSet].sort();
};
