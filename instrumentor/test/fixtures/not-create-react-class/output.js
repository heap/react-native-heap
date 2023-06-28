"use strict";

var TouchableOpacity = {
  displayName: 'TouchableOpacity',
  mixins: [TimerMixin, Touchable.Mixin, NativeMethodsMixin],
  touchableHandlePress: function touchableHandlePress(e) {
    this.props.onPress && this.props.onPress(e);
  },
  touchableHandleLongPress: function touchableHandleLongPress(e) {
    this.props.onLongPress && this.props.onLongPress(e);
  }
};
