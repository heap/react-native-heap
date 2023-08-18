"use strict";

var SwitchWithForwardedRef = (require('@heap/react-native-heap')["default"] || {
  withHeapSwitchAutocapture: function withHeapSwitchAutocapture(Component) {
    return Component;
  }
}).withHeapSwitchAutocapture(function (Component, displayName) {
  if (Component && displayName) {
    Component.displayName = displayName;
  }
  return Component;
}(React.forwardRef(function Switch(props, forwardedRef) {}), "Switch"));
