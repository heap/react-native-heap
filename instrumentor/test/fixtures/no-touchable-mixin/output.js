var TouchableOpacity = createReactClass({
  displayName: 'TouchableOpacity',
  mixins: [TimerMixin, NativeMethodsMixin],
  touchableHandlePress: function touchableHandlePress(e) {
    this.props.onPress && this.props.onPress(e);
  },
  touchableHandleLongPress: function touchableHandleLongPress(e) {
    this.props.onLongPress && this.props.onLongPress(e);
  }
});
