import { getCombinedInclusionList } from './combineConfigs';

const pick = require('lodash.pick');
const flatten = require('flat');

export interface StateNode {
  props?: {
    [propertyKey: string]: any;
  };
  heapOptions?: ClassHeapOptions;
}

export interface FiberNode {
  memoizedProps?: {
    [propertyKey: string]: any;
  };
  stateNode?: StateNode;
  type?: {
    heapOptions?: ClassHeapOptions;
  };
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
  fiberNode: FiberNode,
  config: PropExtractorConfig
): string => {
  if (!fiberNode) {
    return '';
  }

  let classCriteria: PropExtractorCriteria = EMPTY_CRITERIA;

  // For React class components, 'fiberNode' has a 'stateNode' prop that corresponds to the 'this'
  // context of the class instance, so if 'heapOptions' exists, they will be on 'stateNode'. For
  // functional components, there is no 'stateNode', and 'heapOptions' are assigned as a prop to
  // 'type', so if 'heapOptions' exists, they will be on 'type', instead. We should look for
  // 'heapOptions' on 'type' iff 'fiberNode' represents a functional component, i.e. there is no
  // 'stateNode'.
  if (
    fiberNode.stateNode &&
    fiberNode.stateNode.heapOptions &&
    fiberNode.stateNode.heapOptions.eventProps
  ) {
    classCriteria = fiberNode.stateNode.heapOptions
      .eventProps as PropExtractorCriteria;
  } else if (
    !fiberNode.stateNode &&
    fiberNode.type &&
    fiberNode.type.heapOptions &&
    fiberNode.type.heapOptions.eventProps
  ) {
    classCriteria = fiberNode.type.heapOptions
      .eventProps as PropExtractorCriteria;
  }

  const builtInCriteria = config[elementName] || EMPTY_CRITERIA;

  const inclusionList = getCombinedInclusionList([
    builtInCriteria,
    classCriteria,
  ]);

  // :TODO: (jmtaber129): Determine if we should just always get props from 'memoizedProps'.
  let props;
  if (fiberNode.stateNode) {
    props = fiberNode.stateNode.props;
  } else {
    props = fiberNode.memoizedProps;
  }

  let propsString = '';

  // We would like to be able to both include nested objects called out as a whole, as well as
  // entertain props specified by their flattened keys.
  //
  // For example, if input is:
  //   {
  //     nestedObj: {
  //       foo: true,
  //     },
  //   }
  //
  // ... we would like the user to both be able to specify "nestedObj" to include, and all flattened
  // properties will come with it, as well as "nestedObj.foo" and only get the single property.  To
  // do this, we filter the properties in two passes - once to get the whole objects and then a second
  // time to get the flattened keys.

  const firstPassFilteredProps = flatten(pick(props, inclusionList));

  const flattenedProps = { ...flatten(props) };
  const secondPassProps = flatten(pick(flattenedProps, inclusionList));

  const combinedProps = { ...firstPassFilteredProps, ...secondPassProps };

  const sortedKeys = Object.keys(combinedProps).sort();

  // Only include props that are primitives.
  sortedKeys.forEach(key => {
    const prop = combinedProps[key];
    if (prop !== null && prop !== undefined && typeof prop !== 'function') {
      // Remove all brackets from string.
      const propString = prop.toString().replace(/[\[\]]/g, '');
      propsString += `[${key}=${propString}];`;
    }
  });

  return propsString;
};
