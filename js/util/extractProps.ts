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

  const filteredProps = pick(props, inclusionList);
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
