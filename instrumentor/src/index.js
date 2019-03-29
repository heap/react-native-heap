// :TODO: (jmtaber129): Add file-level comment explaining what this plugin does and how it works.

const t = require('babel-types');
const template = require('babel-template');

const buildFunctionWrapper = template(`{
  const Heap = require('@heap/react-native-heap').default;

  AUTOTRACK_EXPRESSION
  ORIGINAL_FUNCTION_CALL
}`);

const buildStartupWrapper = template(`{
  infoLog('Heap: Touchables are instrumented for autocapture.');
  ORIGINAL_FUNCTION_CALL
}`);

const identifierVisitor = {
  Identifier(path) {
    if (path.node.name === 'Touchable') {
      this.visitorState.hasTouchableMixin = true;
    }
  },
};

// Whether this 'createReactClass' object contains 'Touchable.mixin'.
const hasTouchableMixin = path => {
  // :TODO:(jmtaber129): Memoize this using the path's parent.
  return !!path.container.find((node, i) => {
    if (
      node.type === 'ObjectProperty' &&
      node.key.name === 'mixins' &&
      node.value.type === 'ArrayExpression'
    ) {
      const state = { hasTouchableMixin: false };
      path.getSibling(i).traverse(identifierVisitor, { visitorState: state });
      return state.hasTouchableMixin;
    }
  });
};

const instrumentTouchables = path => {
  if (
    path.node.key.name === 'touchableHandlePress' ||
    path.node.key.name === 'touchableHandleLongPress'
  ) {
    const parent = path.findParent(path => {
      return (
        path.isCallExpression() && path.node.callee.name === 'createReactClass'
      );
    });

    if (!(parent && hasTouchableMixin(path))) {
      return;
    }

    // Create the expression for calling the original function for this listener.
    // '(<original function>).call(this, e)'.
    const originalFunctionExpression = path.node.value;
    const callOriginalFunctionExpression = t.memberExpression(
      originalFunctionExpression,
      t.identifier('call')
    );
    const calledFunction = t.callExpression(callOriginalFunctionExpression, [
      t.identifier('this'),
      t.identifier('e'),
    ]);

    // Create the expression for calling Heap autotrack. Pass 'this' so we have the component
    // context to extract the hierarchy, and 'e' so we have context on the event.
    // 'Heap.autotrackPress(<press type>, this, e)'.
    const autotrackExpression = t.callExpression(
      t.memberExpression(t.identifier('Heap'), t.identifier('autotrackPress')),
      [
        t.stringLiteral(path.node.key.name),
        t.identifier('this'),
        t.identifier('e'),
      ]
    );

    // Function body for tracking the Heap event, then calling the original function.
    const functionBody = buildFunctionWrapper({
      AUTOTRACK_EXPRESSION: autotrackExpression,
      ORIGINAL_FUNCTION_CALL: calledFunction,
    });

    // Call the function body with the event parameter 'e'.
    const replacementFunc = t.arrowFunctionExpression(
      [t.identifier('e')],
      functionBody
    );
    path.get('value').replaceWith(replacementFunc);
  }
};

const instrumentStartup = path => {
  if (path.node.key.name === 'runApplication') {
    const parent = path.findParent(path => {
      return (
        path.node.type === 'VariableDeclarator' &&
        path.node.id.name === 'AppRegistry'
      );
    });
    if (!parent) {
      return;
    }

    const originalFunctionExpression = path.node.value;
    const callOriginalFunctionExpression = t.memberExpression(
      originalFunctionExpression,
      t.identifier('call')
    );
    const calledFunction = t.callExpression(callOriginalFunctionExpression, [
      t.identifier('this'),
      t.identifier('appKey'),
      t.identifier('appParameters'),
    ]);
    const functionBody = buildStartupWrapper({
      ORIGINAL_FUNCTION_CALL: calledFunction,
    });
    const replacementFunc = t.arrowFunctionExpression(
      [t.identifier('appKey'), t.identifier('appParameters')],
      functionBody
    );
    path.get('value').replaceWith(replacementFunc);
  }
};

function transform(babel) {
  return {
    visitor: {
      ObjectProperty(path) {
        instrumentStartup(path);
        instrumentTouchables(path);
      },
    },
  };
}

module.exports = transform;
