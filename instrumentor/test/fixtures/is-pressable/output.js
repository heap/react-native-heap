"use strict";

var MemoedPressable = (require('@heap/react-native-heap')["default"] || {
  withHeapPressableAutocapture: function withHeapPressableAutocapture(Component) {
    return Component;
  }
}).withHeapPressableAutocapture(React.memo(React.forwardRef(Pressable)));
