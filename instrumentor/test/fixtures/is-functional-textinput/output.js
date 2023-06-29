"use strict";

var InternalTextInput = (require('@heap/react-native-heap')["default"] || {
  withHeapTextInputAutocapture: function withHeapTextInputAutocapture(Component) {
    return Component;
  }
}).withHeapTextInputAutocapture(function InternalTextInput(props) {});
