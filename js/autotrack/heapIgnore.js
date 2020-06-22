import * as _ from 'lodash';
import React from 'react';

import { getComponentDisplayName } from '../util/hocUtil';

export class HeapIgnore extends React.Component {
  render() {
    return this.props.children;
  }
}
HeapIgnore.displayName = 'HeapIgnore';

// Convenience component for only ignoring target text.
export const HeapIgnoreTargetText = props => {
  return (
    <HeapIgnore
      allowInteraction={true}
      allowInnerHierarchy={true}
      allowAllProps={true}
      allowTargetText={false}
    >
      {props.children}
    </HeapIgnore>
  );
};

export const withHeapIgnore = (IgnoredComponent, heapIgnoreConfig) => {
  class WithHeapIgnore extends React.Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <HeapIgnore {...heapIgnoreConfig}>
          <IgnoredComponent ref={forwardedRef} {...rest}>
            {this.props.children}
          </IgnoredComponent>
        </HeapIgnore>
      );
    }
  }

  WithHeapIgnore.displayName = `withHeapIgnore(${getComponentDisplayName(
    IgnoredComponent
  )})`;

  return React.forwardRef((props, ref) => {
    return <WithHeapIgnore {...props} forwardedRef={ref} />;
  });
};

export const BASE_HEAP_IGNORE_PROPS = {
  allowInteraction: false,
  allowInnerHierarchy: false,
  allowAllProps: false,
  // :TODO: (jmtaber129): Implement 'ignoreSpecificProps'.
  allowTargetText: false,
};

export const getNextHeapIgnoreProps = (currProps, element) => {
  if (element.elementName !== HeapIgnore.displayName) {
    return currProps;
  }

  // Normally, we'd want to check for props on a 'stateNode' that may or may not be present.
  // However, because we know that the HeapIgnore components are functional components, we already
  // know there is not 'stateNode'.
  const specifiedHeapIgnoreProps = _.pick(
    element.fiberNode.memoizedProps,
    Object.keys(BASE_HEAP_IGNORE_PROPS)
  );

  let actualHeapIgnoreProps = {};

  actualHeapIgnoreProps = _.merge(
    {},
    BASE_HEAP_IGNORE_PROPS,
    specifiedHeapIgnoreProps
  );

  // New HeapIgnore props for the subtree should be at least as restrictive as it already was.
  return _.mapValues(currProps, (value, key) => {
    return value && actualHeapIgnoreProps[key];
  });
};
