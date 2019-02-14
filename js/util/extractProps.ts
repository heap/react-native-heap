import { getCombinedInclusionList } from './combineConfigs';

const pick = require('lodash.pick');
const flatten = require('flat');

export interface Component {
  props: {
    [propertyKey: string]: any;
  };
  heapOptions?: ClassHeapOptions;
}

export interface ClassHeapOptions {
  eventProps?: PropExtractorCriteria;
}

export interface PropExtractorCriteria {
  include: string[];
  exclude?: string[];
}

export interface PropExtractorConfig {
  [componentName: string]: PropExtractorCriteria;
}

const EMPTY_CRITERIA = { include: [] };

export const extractProps = (
  elementName: string,
  component: Component,
  config: PropExtractorConfig
): string => {
  if (!component) {
    return '';
  }

  let classCriteria: PropExtractorCriteria = EMPTY_CRITERIA;
  if (component.heapOptions && component.heapOptions.eventProps) {
    classCriteria = component.heapOptions.eventProps as PropExtractorCriteria;
  }

  const builtInCriteria = config[elementName] || EMPTY_CRITERIA;

  const inclusionList = getCombinedInclusionList([
    builtInCriteria,
    classCriteria,
  ]);

  const filteredProps = pick(component.props, inclusionList);
  const flattenedProps = flatten(filteredProps);
  let propsString = '';

  // Only include props that are primitives.
  Object.keys(flattenedProps).forEach(key => {
    if (
      flattenedProps[key] !== null &&
      flattenedProps[key] !== undefined &&
      typeof flattenedProps[key] !== 'function'
    ) {
      // Remove all brackets from string.
      let prop = flattenedProps[key].toString().replace(/[\[\]]/g, '');
      propsString += `[${key}=${prop}];`;
    }
  });

  return propsString;
};
