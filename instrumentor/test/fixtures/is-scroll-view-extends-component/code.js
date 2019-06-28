class ScrollView extends React.Component<Props, State> {
  _scrollResponder: typeof ScrollResponder.Mixin = createScrollResponder(this);

  render() {
    const props = {
      ...this.props,
      onMomentumScrollEnd: this._scrollResponder
        .scrollResponderHandleMomentumScrollEnd,
    };

    const {decelerationRate} = this.props;
    return;
  }
}
