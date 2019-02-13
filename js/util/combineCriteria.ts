import * as Collections from 'typescript-collections';
import { PropExtractorCriteria, PropExtractorConfig } from './extractProps';

export const getCombinedCriteria = (
  componentName: string,
  configs: PropExtractorConfig[]
): PropExtractorCriteria => {
  const inclusionSet = new Collections.Set<string>();

  for (const config of configs) {
    let criteria = config[componentName];

    if (!criteria) {
      continue;
    }

    let configInclusionSet = new Collections.Set<string>();
    let configExclusionSet = new Collections.Set<string>();
    criteria.include.forEach(s => configInclusionSet.add(s));
    if (criteria.exclude) {
      criteria.exclude.forEach(s => configExclusionSet.add(s));
    }

    inclusionSet.difference(configExclusionSet);
    inclusionSet.union(configInclusionSet);
  }

  return { include: inclusionSet.toArray().sort() };
};
