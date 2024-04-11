// :TODO: (jmtaber129): Add file-level comment explaining what this plugin does and how it works.

const t = require('@babel/types');
const template = require('@babel/template').default;

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

const buildHeapImport = template(`(
  require('@heap/react-native-heap').default || {
    HOC_IDENTIFIER: (Component) => Component,
  }
)`);

const buildDisplayNameAssignment = template(`(function (Component, displayName) {
  if (Component && displayName) {
    Component.displayName = displayName;
  }
  return Component;
})(COMPONENT_DEFINITION, DISPLAY_NAME)`);

const buildInstrumentationHoc = template(`
  const COMPONENT_ID = HOC_CALL_EXPRESSION;
`);

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
      t.identifier('this'), // thisExpression
      'autotrackPress', // autotrackMethodName
      path.node.key.name // eventType
    );
    path.get('value').replaceWith(replacementFunc);
  }
};

const instrumentScrollView = path => {
  if (path.node.key.name === 'onMomentumScrollEnd') {
    // Find the parent 'props' declaration.
    const propsParent = path.findParent(path => {
      return path.isVariableDeclarator() && path.node.id.name === 'props';
    });

    if (!propsParent) {
      return;
    }

    // Find the parent 'ScrollView' class.
    const scrollViewParent = propsParent.findParent(path => {
      return (
        path.isVariableDeclarator() &&
        path.node.id.name === 'ScrollView' &&
        // ScrollView in the source is either a class that extends 'React.Component', or it's an
        // object passed to 'createReactClass', depending on RN version.
        (extendsReactComponent(path) ||
          (path.node.init &&
            path.node.init.callee &&
            path.node.init.callee.name === 'createReactClass'))
      );
    });

    if (!scrollViewParent) {
      return;
    }

    // Create the expression for calling the original function for this listener.
    // '(<original function>).call(this, e)'.
    const originalFunctionExpression = path.node.value;

    const replacementFunc = getOriginalFunctionReplacement(
      path.node.value, // originalFunctionExpression
      t.thisExpression(), // thisExpression
      'autocaptureScrollView', // autotrackMethodName
      'scroll_view_page' // eventType
    );
    path.get('value').replaceWith(replacementFunc);
  }
};

const instrumentTextInput = path => {
  if (path.node.key.name === '_onChange') {
    const parent = path.findParent(path => {
      return (
        path.isVariableDeclarator() &&
        path.node.id.name === 'TextInput' &&
        t.isCallExpression(path.node.init) &&
        path.node.init.callee.name === 'createReactClass'
      );
    });

    if (!parent) {
      return;
    }

    // Create the expression for calling the original function for this listener.
    // '(<original function>).call(this, e)'.
    const originalFunctionExpression = path.node.value;

    const replacementFunc = getOriginalFunctionReplacement(
      path.node.value, // originalFunctionExpression
      t.identifier('this'), // thisExpression
      'autocaptureTextInput', // autotrackMethodName
      'text_edit' // eventType
    );
    path.get('value').replaceWith(replacementFunc);
  }
};

const getOriginalFunctionReplacement = (
  originalFunctionExpression,
  thisExpression,
  autotrackMethodName,
  eventType
) => {
  const callOriginalFunctionExpression = t.memberExpression(
    originalFunctionExpression,
    t.identifier('call')
  );

  const calledFunction = t.callExpression(callOriginalFunctionExpression, [
    thisExpression,
    t.identifier('e'),
  ]);

  // Create the expression for calling Heap autotrack. Pass 'this' so we have the component
  // context to extract the hierarchy, and 'e' so we have context on the event.
  // 'Heap.autotrackPress(<press type>, this, e)'.
  const autotrackExpression = t.callExpression(
    t.memberExpression(t.identifier('Heap'), t.identifier(autotrackMethodName)),
    [t.stringLiteral(eventType), thisExpression, t.identifier('e')]
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

const isSwitchNode = path => {
  // The method we want to instrument:
  // * Is named '_handleChange'
  // * Has a variable declarator parent named 'Switch'
  // * The parent extends 'React.Component'.
  if (
    !(
      path.node.left.property &&
      path.node.left.property.name === '_handleChange'
    )
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
};

const instrumentSwitchComponent = path => {
  if (instrumentedComponentNodes.has(path)) {
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
    t.identifier('_this'), // thisExpression
    'autotrackSwitchChange', // autotrackMethodName
    'change' // eventType
  );

  path.get('right').replaceWith(replacementFunc);

  // :KLUDGE: There's some unexpected behavior in the babel traverser that seems to cause the AST
  // node we're instrumenting to be visited multiple times. To avoid unintentionally wrapping the
  // same method multiple times, record that we've instrumented the switch.
  // :TODO: (jmtabe129): Remove this once we figure out what's going on here.
  instrumentedComponentNodes.add(path);
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

const TOUCHABLE_COMPONENTS = [
  'TouchableOpacity',
  'TouchableNativeFeedback',
  'TouchableWithoutFeedback',
  'TouchableHighlight',
];

const instrumentTouchableHoc = path => {
  if (!TOUCHABLE_COMPONENTS.includes(path.node.id.name)) {
    return;
  }

  // 'path.node' represents a class *declaration*, so we need to convert 'path.node' to a class *expression* before we can pass it as an
  // argument to our HOC function.
  const equivalentExpression = t.classExpression(
    path.node.id,
    path.node.superClass,
    path.node.body,
    path.node.decorators || []
  );

  const hocIdentifier = t.identifier('withHeapTouchableAutocapture');

  const heapImport = buildHeapImport({
    HOC_IDENTIFIER: hocIdentifier,
  });

  const autotrackExpression = t.callExpression(
    t.memberExpression(heapImport.expression, hocIdentifier),
    [equivalentExpression]
  );

  const replacement = buildInstrumentationHoc({
    COMPONENT_ID: path.node.id,
    HOC_CALL_EXPRESSION: autotrackExpression,
  });

  path.replaceWith(replacement);
};

const instrumentTextInputHoc = path => {
  if (!path.node.id || path.node.id.name !== 'InternalTextInput') {
    return;
  }

  const equivalentExpression = t.functionExpression(
    path.node.id,
    path.node.params,
    path.node.body
  );

  const hocIdentifier = t.identifier('withHeapTextInputAutocapture');

  const heapImport = buildHeapImport({
    HOC_IDENTIFIER: hocIdentifier,
  });

  const autotrackExpression = t.callExpression(
    t.memberExpression(heapImport.expression, hocIdentifier),
    [equivalentExpression]
  );

  const replacement = buildInstrumentationHoc({
    COMPONENT_ID: path.node.id,
    HOC_CALL_EXPRESSION: autotrackExpression,
  });

  path.replaceWith(replacement);
};

const instrumentPressableHoc = path => {
  // 'MemoedPressable' is the component that actually gets exported from 'Pressable.js' in the react-native library, so wrap that instead of
  // the 'Pressable' component defined in that file.
  // See https://github.com/facebook/react-native/blob/2c896d35782cd04c873aefadc947447cc30a7f60/Libraries/Components/Pressable/Pressable.js#L242-L245.
  if (!path.node.id || path.node.id.name !== 'MemoedPressable') {
    return;
  }

  const hocIdentifier = t.identifier('withHeapPressableAutocapture');

  const heapImport = buildHeapImport({
    HOC_IDENTIFIER: hocIdentifier,
  }).expression;

  const autotrackExpression = t.callExpression(
    t.memberExpression(heapImport, hocIdentifier),
    [path.node.init]
  );

  path.get('init').replaceWith(autotrackExpression);
};

const instrumentSwitchHoc = path => {
  // 'SwitchWithForwardedRef' is the component that gets exported from 'Switch.js' in the react-native library.  The whole component is
  // defined inside a `React.forwardRef` call.
  // See https://github.com/facebook/react-native/blob/4deb29ae1bf71d8da1a18b1a930883854b519949/packages/react-native/Libraries/Components/Switch/Switch.js#L134-L139.
  if (!path.node.id || path.node.id.name !== 'SwitchWithForwardedRef') {
    return;
  }

  const hocIdentifier = t.identifier('withHeapSwitchAutocapture');

  const heapImport = buildHeapImport({
    HOC_IDENTIFIER: hocIdentifier,
  }).expression;

  // Special to "Switch", the component doesn't have a display name.  Per a suggestion in another comment, I'm fixing this up in Switch.js.
  const initWithDisplayName = buildDisplayNameAssignment({
    COMPONENT_DEFINITION: path.node.init,
    DISPLAY_NAME: t.stringLiteral('Switch'),
  }).expression;

  const autotrackExpression = t.callExpression(
    t.memberExpression(heapImport, hocIdentifier),
    [initWithDisplayName]
  );

  path.get('init').replaceWith(autotrackExpression);
};

function transform(babel) {
  return {
    visitor: {
      ObjectProperty(path) {
        instrumentStartup(path);
        instrumentTouchables(path);
        instrumentScrollView(path);
        instrumentTextInput(path);
      },
      AssignmentExpression(path) {
        instrumentSwitchComponent(path);
      },
      ClassDeclaration(path) {
        instrumentTouchableHoc(path);
      },
      FunctionDeclaration(path) {
        instrumentTextInputHoc(path);
      },
      VariableDeclarator(path) {
        instrumentPressableHoc(path);
        instrumentSwitchHoc(path);
      },
    },
  };
}

module.exports = transform;
