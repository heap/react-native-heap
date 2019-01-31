const pick = require('lodash.pick');
const flatten = require('flat');

export interface Component {
  //TODO: use the real RN ones
  props: {
    [propertyKey: string]: any;
  };
}

export interface PropExtractorCriteria {
  include: string[];
  exclude: string[];
}

export interface PropExtractorConfig {
  [componentName: string]: PropExtractorCriteria;
}

export const extractProps = (
  elementName: string,
  component: Component,
  config: PropExtractorConfig
): string => {
  if (!component || !config[elementName]) {
    return '';
  }

  const filteredProps = pick(component.props, config[elementName].include);
  const flattenedProps = flatten(filteredProps);
  let propsString = '';

  // Only include props that are primitives.
  Object.keys(flattenedProps).forEach(key => {
    if (
      flattenedProps[key] !== null &&
      flattenedProps[key] !== undefined &&
      typeof flattenedProps[key] !== 'function'
    ) {
      propsString += `[${key}=${flattenedProps[key]}];`;
    }
  });

  return propsString;
};
