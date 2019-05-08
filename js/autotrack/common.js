import * as _ from 'lodash';

import { extractProps } from '../util/extractProps';
import { builtinPropExtractorConfig } from '../propExtractorConfig';

// Returns an object containing a base set of component properties if we're not ignoring the
// full interaction due to HeapIgnore.
// Returns null if we're ignoring the full interaction due to HeapIgnore.
export const getBaseComponentProps = componentThis => {
  // Get the hierarchy traversal from root to target component, then get the actual hierarchy from
  // the traversal representation.
  const touchableHierarchyTraversal = getComponentHierarchyTraversal(componentThis);
  const { hierarchy, heapIgnoreProps } = getHierarchyStringFromTraversal(touchableHierarchyTraversal);

  if (heapIgnoreProps.ignoreInteraction) {
    return null;
  }

  // Only look for target text if we're not HeapIgnore-ing target text.
  let targetText;
  if (!heapIgnoreProps.ignoreTargetText) {
    targetText = getTargetText(componentThis._reactInternalFiber);
  } else {
    targetText = '';
  }

  const autotrackProps = {
    touchableHierarchy: hierarchy,
  };

  if (targetText !== '') {
    autotrackProps.targetText = targetText;
  }

  return autotrackProps;
};

const getComponentHierarchyTraversal = componentThis => {
  // :TODO: (jmtaber129): Remove this if/when we support pre-fiber React.
  if (!componentThis._reactInternalFiber) {
    throw new Error(
      'Pre-fiber React versions (React 16) are currently not supported by Heap autotrack.'
    );
  }

  return getFiberNodeComponentHierarchyTraversal(componentThis._reactInternalFiber);
};

// Traverse up the hierarchy from the current component up to the root, and return an array of
// objects representing the component hierarchy from root to the current node. Each object element
// contains:
// * elementName - The name of the component
// * fiberNode - The FiberNode reference for the component
// * propsString - The string of props obtained from extractProps().
const getFiberNodeComponentHierarchyTraversal = currNode => {
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

  const propsString = extractProps(
    elementName,
    currNode,
    builtinPropExtractorConfig
  );

  const parentHierarchyRepresentation = getFiberNodeComponentHierarchyTraversal(
    currNode.return
  );

  parentHierarchyRepresentation.push({
    elementName,
    fiberNode: currNode,  // Needed to get all props on HeapIgnore components.
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
const getHierarchyStringFromTraversal = hierarchyArray => {
  let currentHeapIgnoreProps = {
    ignoreInteraction: false,
    ignoreInnerHierarchy: false,
    ignoreAllProps: false,
    ignoreTargetText: false,
  };

  // Map each hierarchy element to its string representation, considering HeapIgnore specs.
  const hierarchyStrings = hierarchyArray.map(element => {
    // If we're not using any part of the hierarchy (for 'ignoreInteraction') or not capturing the
    // current subhierarchy, return an empty string for the current component.
    if (currentHeapIgnoreProps.ignoreInteraction || currentHeapIgnoreProps.ignoreInnerHierarchy) {
      return '';
    }

    if (currentHeapIgnoreProps.ignoreAllProps) {
      return `${element.elementName};|`;
    }

    // Doing this at the end allows us to capture HeapIgnore components.
    currentHeapIgnoreProps = getNewHeapIgnoreProps(currentHeapIgnoreProps, element);

    return `${element.elementName};${element.propsString}|`;
  }).join('');

  return {
    heapIgnoreProps: currentHeapIgnoreProps,
    hierarchy: hierarchyStrings,
  };
};

const BASE_HEAP_IGNORE_PROPS = {
  ignoreInteraction: true,
  ignoreInnerHierarchy: true,
  ignoreAllProps: true,
  // :TODO: (jmtaber129): Implement 'ignoreSpecificProps'.
  ignoreTargetText: true,
};

const BASE_HEAP_CAPTURE_RESTRICTOR_PROPS = {
  ignoreInteraction: false,
  ignoreInnerHierarchy: false,
  ignoreAllProps: false,
  // :TODO: (jmtaber129): Implement 'ignoreSpecificProps'.
  ignoreTargetText: false,
}

const getNewHeapIgnoreProps = (currProps, element) => {
  if (element.elementName !== 'HeapIgnore' && element.elementName !== 'HeapCaptureRestrictor') {
    return currProps;
  }

  // Normally, we'd want to check for props on a 'stateNode' that may or may not be present.
  // However, because we know that the HeapIgnore components are functional components, we already
  // know there is not 'stateNode'.
  const specifiedHeapIgnoreProps = _.pick(element.fiberNode.memoizedProps, [
    'ignoreInteraction',
    'ignoreInnerHierarchy',
    'ignoreAllProps',
    // :TODO: (jmtaber129): Implement 'ignoreSpecificProps'.
    'ignoreTargetText',
  ]);

  let actualHeapIgnoreProps = {};

  if (element.elementName === 'HeapIgnore') {
    actualHeapIgnoreProps = _.merge({}, BASE_HEAP_IGNORE_PROPS, specifiedHeapIgnoreProps);
  } else {
    actualHeapIgnoreProps = _.merge({}, BASE_HEAP_CAPTURE_RESTRICTOR_PROPS, specifiedHeapIgnoreProps);
  }

  // New HeapIgnore props for the subtree should be at least as restrictive as it already was.
  return _.mapValues(currProps, (value, key) => {
    return value || actualHeapIgnoreProps[key];
  });
}

// :TODO: (jmtaber129): Consider implementing sibling target text.
const getTargetText = fiberNode => {
  if (fiberNode.type === 'RCTText') {
    return fiberNode.memoizedProps.children;
  }

  if (fiberNode.child === null) {
    return '';
  }

  const children = [];
  let currChild = fiberNode.child;
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
