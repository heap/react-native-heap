const ScrollView = createReactClass({
  render() {
    const props = {
      ...this.props,
      onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
    };

    const {decelerationRate} = this.props;
    return;
  }
})
