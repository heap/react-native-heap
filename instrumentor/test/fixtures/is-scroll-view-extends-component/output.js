var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var ScrollView = function (_React$Component) {
  (0, _inherits2.default)(ScrollView, _React$Component);

  function ScrollView() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, ScrollView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(ScrollView)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this._scrollResponder = createScrollResponder((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(ScrollView, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var props = (0, _objectSpread2.default)({}, this.props, {
        onMomentumScrollEnd: function onMomentumScrollEnd(e) {
          var Heap = require('@heap/react-native-heap').default;

          Heap.autocaptureScrollView("scrollViewPage", _this2, e);

          _this2._scrollResponder.scrollResponderHandleMomentumScrollEnd.call(_this2, e);
        }
      });
      var decelerationRate = this.props.decelerationRate;
      return;
    }
  }]);
  return ScrollView;
}(React.Component);
