import * as Collections from 'typescript-collections';
import { PropExtractorCriteria } from './extractProps';

export const getCombinedInclusionList = (
  criteriaList: PropExtractorCriteria[]
): string[] => {
  const inclusionSet = new Collections.Set<string>();
  const exclusionSet = new Collections.Set<string>();

  for (const criteria of criteriaList) {
    const configInclusionSet = new Collections.Set<string>();
    const configExclusionSet = new Collections.Set<string>();
    criteria.include.forEach(s => configInclusionSet.add(s));
    if (criteria.exclude) {
      criteria.exclude.forEach(s => configExclusionSet.add(s));
    }

    inclusionSet.union(configInclusionSet);
    exclusionSet.union(configExclusionSet);
  }

  inclusionSet.difference(exclusionSet);

  // Sorting here so that the order is consistent across calls.
  return inclusionSet.toArray().sort();
};
