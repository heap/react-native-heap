import * as Collections from 'typescript-collections';
import { PropExtractorCriteria, PropExtractorConfig } from './extractProps';

export const getCombinedCriteria = (
  componentName: string,
  configs: PropExtractorConfig[]
): PropExtractorCriteria => {
  let remainingConfigs: PropExtractorConfig[] = [...configs];
  let inclusionSet = new Collections.Set<string>();

  while (remainingConfigs.length > 0) {
    let config = remainingConfigs.shift();
    let criteria = config[componentName];

    if (!criteria) {
      continue;
    }

    let configInclusionSet = new Collections.Set<string>();
    let configExclusionSet = new Collections.Set<string>();
    criteria.include.map(s => configInclusionSet.add(s));
    if (criteria.exclude) {
      criteria.exclude.map(s => configExclusionSet.add(s));
    }

    inclusionSet.difference(configExclusionSet);
    inclusionSet.union(configInclusionSet);
  }

  return { include: inclusionSet.toArray().sort() };
};
