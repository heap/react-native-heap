// :TODO: (jmtaber129): Add file-level comment explaining what this plugin does and how it works.

const t = require('babel-types');
const template = require('babel-template');

const SWITCH_COMPONENT_NAME = 'switch';

// Used to record whether certain methods/components have been instrumented.
// :TODO: (jmtaber129): Determine whether we actually need this once we figure out the unexpected
// behavior with the instrumented Switch node being visited multiple times.
const instrumentedComponentNodes = new Set();

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

    const replacementFunc = getOriginalFunctionReplacement(
      path.node.value, // originalFunctionExpression
      'this', // thisIdentifier
      'autotrackPress', // autotrackMethodName
      path.node.key.name // eventType
    );
    path.get('value').replaceWith(replacementFunc);
  }
};

const getOriginalFunctionReplacement = (
  originalFunctionExpression,
  thisIdentifier,
  autotrackMethodName,
  eventType
) => {
  const callOriginalFunctionExpression = t.memberExpression(
    originalFunctionExpression,
    t.identifier('call')
  );

  const calledFunction = t.callExpression(callOriginalFunctionExpression, [
    t.identifier(thisIdentifier),
    t.identifier('e'),
  ]);

  // Create the expression for calling Heap autotrack. Pass 'this' so we have the component
  // context to extract the hierarchy, and 'e' so we have context on the event.
  // 'Heap.autotrackPress(<press type>, this, e)'.
  const autotrackExpression = t.callExpression(
    t.memberExpression(t.identifier('Heap'), t.identifier(autotrackMethodName)),
    [
      t.stringLiteral(eventType),
      t.identifier(thisIdentifier),
      t.identifier('e'),
    ]
  );

  // Function body for tracking the Heap event, then calling the original function.
  const functionBody = buildFunctionWrapper({
    AUTOTRACK_EXPRESSION: autotrackExpression,
    ORIGINAL_FUNCTION_CALL: calledFunction,
  });

  // Call the function body with the event parameter 'e'.
  return t.arrowFunctionExpression([t.identifier('e')], functionBody);
};

const extendsReactComponent = path => {
  // By the time we start traversing the AST for Switch.js, the 'Switch' class looks like:
  //
  //   var Switch = function (_React$Component) {
  //     (0, _inherits2.default)(Switch, _React$Component);
  //
  //     function Switch() {
  //       <class body>
  //     }
  //
  //     return Switch;
  //   }(React.Component);
  //
  // so to determine whether this extends 'React.Component', we should check the argument to the
  // function on the RHS of the variable declarator node for 'React.Component' or 'Component'.
  // :TODO: (jmtaber129): Consider adding a check for the line that looks like:
  //   (0, _inherits2.default)(Switch, _React$Component)
  const reactComponentCandidate =
    path.node.init && path.node.init.arguments && path.node.init.arguments[0];
  return (
    reactComponentCandidate &&
    ((reactComponentCandidate.object &&
      reactComponentCandidate.object.name === 'React' &&
      reactComponentCandidate.property &&
      reactComponentCandidate.property.name === 'Component') ||
      reactComponentCandidate.name === 'Component')
  );
};

const isSwitchNode = (path) => {
  // The method we want to instrument:
  // * Is named '_handleChange'
  // * Has a variable declarator parent named 'Switch'
  // * The parent extends 'React.Component'.
  if (
    !(path.node.left.property &&
    path.node.left.property.name === '_handleChange')
  ) {
    return false;
  }

  const parent = path.findParent(path => {
    return (
      path.isVariableDeclarator() &&
      path.node.id.name === 'Switch' &&
      extendsReactComponent(path)
    );
  });

  return !!parent;
}

const instrumentSwitchComponent = path => {
  if (instrumentedComponentNodes.has(SWITCH_COMPONENT_NAME)) {
    // We already instrumented the switch, so do nothing.
    return;
  }

  if (!isSwitchNode(path)) {
    return;
  }

  // Create the expression for calling the original function for this listener.
  // '(<original function>).call(this, e)'.
  const originalFunctionExpression = path.node.right;
  const replacementFunc = getOriginalFunctionReplacement(
    originalFunctionExpression, // originalFunctionExpression
    '_this', // thisIdentifier
    'autotrackSwitchChange', // autotrackMethodName
    path.node.left.property.name // eventType
  );

  path.get('right').replaceWith(replacementFunc);

  // :KLUDGE: There's some unexpected behavior in the babel traverser that seems to cause the AST
  // node we're instrumenting to be visited multiple times. To avoid unintentionally wrapping the
  // same method multiple times, record that we've instrumented the switch.
  // :TODO: (jmtabe129): Remove this once we figure out what's going on here.
  instrumentedComponentNodes.add(SWITCH_COMPONENT_NAME);
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
      AssignmentExpression(path) {
        instrumentSwitchComponent(path);
      },
    },
  };
}

module.exports = transform;
