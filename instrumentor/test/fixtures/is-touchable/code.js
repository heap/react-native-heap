const TouchableOpacity = ((createReactClass({
  displayName: 'TouchableOpacity',
  mixins: [TimerMixin, Touchable.Mixin, NativeMethodsMixin],

  touchableHandlePress: function(e: Event) {
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleLongPress: function(e: Event) {
    this.props.onLongPress && this.props.onLongPress(e);
  },
})));
