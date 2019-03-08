import { extractProps } from '../util/extractProps';
import { builtinPropExtractorConfig } from '../propExtractorConfig';

export const autotrackPress = track => (eventType, componentThis, event) => {
  const touchableHierarchy = getComponentHierarchy(componentThis);
  const touchState =
    componentThis &&
    componentThis.state &&
    componentThis.state.touchable &&
    componentThis.state.touchable.touchState;

  const targetText = getTargetText(componentThis._reactInternalFiber);

  const autotrackProps = {
    touchableHierarchy,
    touchState,
  };

  if (targetText !== '') {
    autotrackProps.targetText = targetText;
  }

  track(eventType, autotrackProps);
};

const getComponentHierarchy = componentThis => {
  // :TODO: (jmtaber129): Remove this if/when we support pre-fiber React.
  if (!componentThis._reactInternalFiber) {
    throw new Error(
      'Pre-fiber React versions (React 16) are currently not supported by Heap autotrack.'
    );
  }

  return getFiberNodeComponentHierarchy(componentThis._reactInternalFiber);
};

const getFiberNodeComponentHierarchy = currNode => {
  if (currNode === null) {
    return '';
  }

  // Skip components we don't care about.
  // :TODO: (jmtaber129): Skip components with names/display names like 'View' and '_class'.
  if (
    currNode.type === 'RCTView' ||
    currNode.type === null ||
    !(currNode.type.displayName || currNode.type.name)
  ) {
    return getFiberNodeComponentHierarchy(currNode.return);
  }

  const elementName = currNode.type.displayName || currNode.type.name;

  // In dev builds, 'View' components remain in the fiber tree, but don't provide any useful
  // information, so exclude these from the hierarchy.
  if (elementName === 'View') {
    return getFiberNodeComponentHierarchy(currNode.return);
  }

  const propsString = extractProps(
    elementName,
    currNode,
    builtinPropExtractorConfig
  );

  return `${getFiberNodeComponentHierarchy(
    currNode.return
  )}${elementName};${propsString}|`;
};

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
