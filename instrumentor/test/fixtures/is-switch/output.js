"use strict";

var SwitchWithForwardedRef = (require('@heap/react-native-heap')["default"] || {
  withHeapSwitchAutocapture: function withHeapSwitchAutocapture(Component) {
    return Component;
  }
}).withHeapSwitchAutocapture(React.forwardRef(function Switch(props, forwardedRef) {}));
