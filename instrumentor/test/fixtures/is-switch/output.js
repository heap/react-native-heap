'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var Switch = function (_React$Component) {
  (0, _inherits2.default)(Switch, _React$Component);

  function Switch() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, Switch);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(Switch)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this._handleChange = function (e) {
      var Heap = require('@heap/react-native-heap').default;

      Heap.autotrackSwitchChange("_handleChange", _this, e);
      (function (event) {
        if (_this._nativeSwitchRef == null) {
          return;
        }

        var value = _this.props.value === true;

        if (Platform.OS === 'android') {
          _this._nativeSwitchRef.setNativeProps({
            on: value
          });
        } else {
          _this._nativeSwitchRef.setNativeProps({
            value: value
          });
        }

        if (_this.props.onChange != null) {
          _this.props.onChange(event);
        }

        if (_this.props.onValueChange != null) {
          _this.props.onValueChange(event.nativeEvent.value);
        }
      }).call(_this, e);
    };

    return _this;
  }

  return Switch;
}(React.Component);
