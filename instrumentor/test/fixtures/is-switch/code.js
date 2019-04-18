'use strict';

class Switch extends React.Component<Props> {
  _handleChange = (event: SwitchChangeEvent) => {
    if (this._nativeSwitchRef == null) {
      return;
    }

    // Force value of native switch in order to control it.
    const value = this.props.value === true;
    if (Platform.OS === 'android') {
      this._nativeSwitchRef.setNativeProps({on: value});
    } else {
      this._nativeSwitchRef.setNativeProps({value});
    }

    if (this.props.onChange != null) {
      this.props.onChange(event);
    }

    if (this.props.onValueChange != null) {
      this.props.onValueChange(event.nativeEvent.value);
    }
  };
}
