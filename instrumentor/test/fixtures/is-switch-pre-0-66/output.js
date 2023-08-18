'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Switch = function (_React$Component) {
  (0, _inherits2["default"])(Switch, _React$Component);
  var _super = _createSuper(Switch);
  function Switch() {
    var _this;
    (0, _classCallCheck2["default"])(this, Switch);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _this._handleChange = function (e) {
      var Heap = require('@heap/react-native-heap')["default"];
      Heap.autotrackSwitchChange("change", _this, e);
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
  return (0, _createClass2["default"])(Switch);
}(React.Component);