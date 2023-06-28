"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ScrollView = createReactClass({
  displayName: "ScrollView",
  render: function render() {
    var _this = this;
    var props = _objectSpread(_objectSpread({}, this.props), {}, {
      onMomentumScrollEnd: function onMomentumScrollEnd(e) {
        var Heap = require('@heap/react-native-heap')["default"];
        Heap.autocaptureScrollView("scroll_view_page", _this, e);
        _this.scrollResponderHandleMomentumScrollEnd.call(_this, e);
      }
    });
    var decelerationRate = this.props.decelerationRate;
    return;
  }
});