import * as Collections from 'typescript-collections';
import { PropExtractorConfig } from './extractProps';

export const getCombinedInclusionList = (
  componentName: string,
  configs: PropExtractorConfig[]
): string[] => {
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

  return inclusionSet.toArray().sort();
};
