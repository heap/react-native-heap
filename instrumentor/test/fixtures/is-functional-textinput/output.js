var Heap = require('@heap/react-native-heap').default || {
  withHeapTextInputAutocapture: function withHeapTextInputAutocapture(Component) {
    return Component;
  }
};
var InternalTextInput = Heap.withHeapTextInputAutocapture(function InternalTextInput(props) {});
