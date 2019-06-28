var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var ScrollView = createReactClass({
  displayName: "ScrollView",
  render: function render() {
    var _this2 = this;

    var props = (0, _objectSpread2.default)({}, this.props, {
      onMomentumScrollEnd: function onMomentumScrollEnd(e) {
        var Heap = require('@heap/react-native-heap').default;

        Heap.autocaptureScrollView("scrollViewPage", _this, e);

        _this2.scrollResponderHandleMomentumScrollEnd.call(_this, e);
      }
    });
    var decelerationRate = this.props.decelerationRate;
    return;
  }
});
