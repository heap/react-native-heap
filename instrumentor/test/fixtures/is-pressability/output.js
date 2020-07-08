var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var Pressability = function Pressability(config) {
  (0, _classCallCheck2.default)(this, Pressability);

  var Heap = require('@heap/react-native-heap').default;

  config = Heap.wrapPressabilityConfig(config) || config;
  this._config = config;
};

exports.default = Pressability;
