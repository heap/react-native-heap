const SwitchWithForwardedRef: React.AbstractComponent<
  Props,
  React.ElementRef<
    typeof SwitchNativeComponent | typeof AndroidSwitchNativeComponent,
  >,
> = React.forwardRef(function Switch(props, forwardedRef): React.Node {});
