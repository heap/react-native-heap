var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var NotAScrollView = function (_React$Component) {
  (0, _inherits2.default)(NotAScrollView, _React$Component);

  function NotAScrollView() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, NotAScrollView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(NotAScrollView)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this._scrollResponder = createScrollResponder((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(NotAScrollView, [{
    key: "render",
    value: function render() {
      var props = (0, _objectSpread2.default)({}, this.props, {
        onMomentumScrollEnd: this._scrollResponder.scrollResponderHandleMomentumScrollEnd
      });
      var decelerationRate = this.props.decelerationRate;
      return;
    }
  }]);
  return NotAScrollView;
}(React.Component);
