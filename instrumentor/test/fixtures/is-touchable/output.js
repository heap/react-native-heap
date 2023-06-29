"use strict";

var TouchableOpacity = createReactClass({
  displayName: 'TouchableOpacity',
  mixins: [TimerMixin, Touchable.Mixin, NativeMethodsMixin],
  touchableHandlePress: function touchableHandlePress(e) {
    var Heap = require('@heap/react-native-heap')["default"];
    Heap.autotrackPress("touchableHandlePress", this, e);
    (function (e) {
      this.props.onPress && this.props.onPress(e);
    }).call(this, e);
  },
  touchableHandleLongPress: function touchableHandleLongPress(e) {
    var Heap = require('@heap/react-native-heap')["default"];
    Heap.autotrackPress("touchableHandleLongPress", this, e);
    (function (e) {
      this.props.onLongPress && this.props.onLongPress(e);
    }).call(this, e);
  }
});
