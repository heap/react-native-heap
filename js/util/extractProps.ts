import * as React from 'react';
import { getCombinedInclusionList } from './combineConfigs';
import {
  containsReservedCharacter,
  stripReservedCharacters,
} from './reservedCharacters';

const _ = require('lodash');
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
  key?: any;
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
  fiberNode: FiberNode | null,
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

  const wildcardCriteria = config['*'] || EMPTY_CRITERIA;
  const builtInCriteria = config[elementName] || EMPTY_CRITERIA;

  const inclusionList = getCombinedInclusionList([
    wildcardCriteria,
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

  const filteredProps = _(props)
    .pick(inclusionList)
    .mapValues((prop: any) => {
      if (React.isValidElement(prop)) {
        // :TODO: (jmtaber129): Consider pulling information from the React element.
        return 'React.element';
      }
      return prop;
    })
    .value();

  // KLUDGE: We want to capture the `key` property for list components that have it set,
  // but we can't simply add to the list of props captured for all components in
  // `propExtractorConfig` because `props.key` is always undefined and guarded with
  // a yellowbox warning; this is to prevent client code from appropriating the `key`
  // prop for its own use; it is intended to be reserved for internal use. (HEAP-8473)
  const flattenedProps = Object.assign(
    { key: fiberNode.key },
    flatten(filteredProps, { maxDepth: 4 })
  );

  let propsString = '';

  // Only include props that are primitives.
  Object.keys(flattenedProps).forEach(key => {
    if (
      flattenedProps[key] !== null &&
      flattenedProps[key] !== undefined &&
      typeof flattenedProps[key] !== 'function'
    ) {
      if (containsReservedCharacter(key)) {
        console.warn(
          `Prop key '${key}' contains reserved characters; ignoring.`
        );
        return;
      }

      const prop = stripReservedCharacters(flattenedProps[key].toString());
      propsString += `[${key}=${prop}];`;
    }
  });

  return propsString;
};
