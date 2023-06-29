"use strict";

var NonTextInput = createReactClass({
  displayName: 'NonTextInput',
  mixins: [NativeMethodsMixin],
  _onChange: function _onChange(event) {
    if (this._inputRef && this._inputRef.setNativeProps) {
      ReactNative.setNativeProps(this._inputRef, {
        mostRecentEventCount: event.nativeEvent.eventCount
      });
    }
    var text = event.nativeEvent.text;
    this.props.onChange && this.props.onChange(event);
    this.props.onChangeText && this.props.onChangeText(text);
    if (!this._inputRef) {
      return;
    }
    this._lastNativeText = text;
    this.forceUpdate();
  },
  _onSelectionChange: function _onSelectionChange(event) {
    this.props.onSelectionChange && this.props.onSelectionChange(event);
    if (!this._inputRef) {
      return;
    }
    this._lastNativeSelection = event.nativeEvent.selection;
    if (this.props.selection || this.props.selectionState) {
      this.forceUpdate();
    }
  }
});
