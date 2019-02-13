import { getCombinedCriteria } from './combineCriteria';

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

export const extractProps = (
  elementName: string,
  component: Component,
  config: PropExtractorConfig
): string => {
  if (!component) {
    return '';
  }

  let classCriteria: PropExtractorCriteria = { include: [] };
  if (component.heapOptions && component.heapOptions.eventProps) {
    classCriteria = component.heapOptions.eventProps as PropExtractorCriteria;
  }
  let classConfig = { [elementName]: classCriteria };
  const criteria = getCombinedCriteria(elementName, [config, classConfig]);

  const filteredProps = pick(component.props, criteria.include);
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
