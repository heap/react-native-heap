import * as _ from 'lodash';

import { Component as ReactComponent } from 'React';
import { Fiber as FiberNode } from 'react-reconciler';
import { extractProps } from '../util/extractProps';
import { BASE_HEAP_IGNORE_PROPS, getNextHeapIgnoreProps } from './heapIgnore';
import { builtinPropExtractorConfig } from '../propExtractorConfig';

// Base properties for autotracked events.
interface AutotrackProps {
  touchableHierarchy: string;
  targetText?: string;
}

// The type definition of 'Component' from '@types/react' doesn't include the internal
// '_reactInternalFiber' property, so create our own 'Component' type that includes this prop.
interface Component extends ReactComponent {
  _reactInternalFiber: FiberNode;
}

interface HeapIgnoreProps {
  allowInteraction?: boolean;
  allowInnerHierarchy?: boolean;
  allowAllProps?: boolean;
  // :TODO: (jmtaber129): Add 'ignoreSpecificProps'.
  allowTargetText?: boolean;
}

// The result of traversing up and back down a component's hierarchy.
interface HierarchyResult {
  hierarchy: string;
  heapIgnoreProps: HeapIgnoreProps;
}

// The representation of a component in a Fiber hierarchy.
interface ComponentHierarchyTraversalElement {
  elementName: string;
  fiberNode: FiberNode;
  propsString: string;
}

// Returns an object containing a base set of component properties if we're not ignoring the
// full interaction due to HeapIgnore.
// Returns null if we're ignoring the full interaction due to HeapIgnore.
export const getBaseComponentProps: (
  component: Component
) => AutotrackProps | null = componentThis => {
  // Get the hierarchy traversal from root to target component, then get the actual hierarchy from
  // the traversal representation.
  const touchableHierarchyTraversal: ComponentHierarchyTraversalElement[] = getComponentHierarchyTraversal(
    componentThis
  );
  const {
    hierarchy,
    heapIgnoreProps,
  }: HierarchyResult = getHierarchyStringFromTraversal(
    touchableHierarchyTraversal
  );

  if (!heapIgnoreProps.allowInteraction) {
    return null;
  }

  // Only look for target text if we're not HeapIgnore-ing target text.
  let targetText;
  if (heapIgnoreProps.allowTargetText) {
    targetText = getTargetText(componentThis._reactInternalFiber);
  } else {
    targetText = '';
  }

  const autotrackProps: AutotrackProps = {
    touchableHierarchy: hierarchy,
  };

  if (targetText !== '') {
    autotrackProps.targetText = targetText;
  }

  return autotrackProps;
};

const getComponentHierarchyTraversal: (
  comp: Component
) => ComponentHierarchyTraversalElement[] = componentThis => {
  // :TODO: (jmtaber129): Remove this if/when we support pre-fiber React.
  if (!componentThis._reactInternalFiber) {
    throw new Error(
      'Pre-fiber React versions (React 16) are currently not supported by Heap autotrack.'
    );
  }

  return getFiberNodeComponentHierarchyTraversal(
    componentThis._reactInternalFiber
  );
};

// Traverse up the hierarchy from the current component up to the root, and return an array of
// objects representing the component hierarchy from root to the current node.
const getFiberNodeComponentHierarchyTraversal: (
  currNode: FiberNode | null
) => ComponentHierarchyTraversalElement[] = currNode => {
  if (currNode === null) {
    return [];
  }

  // Skip components we don't care about.
  // :TODO: (jmtaber129): Skip components with names/display names like 'View' and '_class'.
  if (
    currNode.type === 'RCTView' ||
    currNode.type === null ||
    !(currNode.type.displayName || currNode.type.name)
  ) {
    return getFiberNodeComponentHierarchyTraversal(currNode.return);
  }

  const elementName = currNode.type.displayName || currNode.type.name;

  // In dev builds, 'View' components remain in the fiber tree, but don't provide any useful
  // information, so exclude these from the hierarchy.
  if (elementName === 'View') {
    return getFiberNodeComponentHierarchyTraversal(currNode.return);
  }

  const propsString: string = extractProps(
    elementName,
    currNode,
    builtinPropExtractorConfig
  );

  const parentHierarchyRepresentation: ComponentHierarchyTraversalElement[] = getFiberNodeComponentHierarchyTraversal(
    currNode.return
  );

  parentHierarchyRepresentation.push({
    elementName,
    fiberNode: currNode, // Needed to get all props on HeapIgnore components.
    propsString, // :TODO: Make this an object so we can use it with 'ignoreSpecificProps'
  });

  return parentHierarchyRepresentation;
};

// Given an object array representing the component hierarchy from root to target component,
// traverse through the element list to create the string representation of the hierarchy, taking
// into account HeapIgnore specifications.
// Returns an object containing:
// * hierarchy - the string hierarchy representation of 'hierarchyArray'.
// * heapIgnoreProps - the final set of HeapIgnore props that applies to the target component. Used
//     to determine whether to include target text and/or ignore the entire interaction.
const getHierarchyStringFromTraversal: (
  hierarchyArray: ComponentHierarchyTraversalElement[]
) => HierarchyResult = hierarchyArray => {
  let currentHeapIgnoreProps: HeapIgnoreProps = _.mapValues(
    BASE_HEAP_IGNORE_PROPS,
    () => true
  );

  // Map each hierarchy element to its string representation, considering HeapIgnore specs.
  const hierarchyStrings: string = hierarchyArray
    .map(element => {
      let currElementString = '';
      if (
        !currentHeapIgnoreProps.allowInteraction ||
        !currentHeapIgnoreProps.allowInnerHierarchy
      ) {
        // If we're not using any part of the hierarchy (for 'allowInteraction') or not capturing the
        // current subhierarchy, return an empty string for the current component.
        currElementString = '';
      } else if (!currentHeapIgnoreProps.allowAllProps) {
        currElementString = `${element.elementName};|`;
      } else {
        currElementString = `${element.elementName};${element.propsString}|`;
      }

      // Doing this at the end allows us to capture HeapIgnore components.
      currentHeapIgnoreProps = getNextHeapIgnoreProps(
        currentHeapIgnoreProps,
        element
      );

      return currElementString;
    })
    .join('');

  return {
    heapIgnoreProps: currentHeapIgnoreProps,
    hierarchy: hierarchyStrings,
  };
};

// :TODO: (jmtaber129): Consider implementing sibling target text.
const getTargetText: (fiberNode: FiberNode) => string = fiberNode => {
  if (fiberNode.type === 'RCTText') {
    return fiberNode.memoizedProps.children;
  }

  // In some cases, target text may not be within an 'RCTText' component. This has only been
  // observed in unit tests with Enzyme, but may still be a possibility in real RN apps.
  if (
    fiberNode.memoizedProps &&
    typeof fiberNode.memoizedProps.children === 'string'
  ) {
    return fiberNode.memoizedProps.children;
  }

  if (fiberNode.child === null) {
    return '';
  }

  const children: FiberNode[] = [];
  let currChild: FiberNode | null = fiberNode.child;
  while (currChild) {
    children.push(currChild);
    currChild = currChild.sibling;
  }

  let targetText = '';
  children.forEach(child => {
    targetText = (targetText + ' ' + getTargetText(child)).trim();
  });
  return targetText;
};
