// Libraries
import {NativeModules, Platform} from 'react-native';

// Native Modules
const {RNHeap} = NativeModules;


// Wraps native functions so they are no-ops on android.
const noop = () => {};
const safe = (callback) => Platform.OS === 'android' ? noop : callback;
const guard = (object) => {
  const safeObject = {};

  // Copies all key/values and wraps each value inside a safe callback.
  Object.keys(object).forEach(key => safeObject[key] = safe(object[key]));

  // Returns the new cloned object.
  return safeObject;
};


const Heap = {
  // App Properties
  setAppId: (appId) => RNHeap.setAppId(appId),

  // User Properties
  identify: (identity) => RNHeap.identify(identity),
  addUserProperties: (properties) => RNHeap.addUserProperties(properties),

  // Event Properties
  addEventProperties: (properties) => RNHeap.addEventProperties(properties),
  removeEventProperty: (property) => RNHeap.removeEventProperty(property),
  clearEventProperties: () => RNHeap.clearEventProperties(),

  // Events
  track: (event, payload) => RNHeap.track(event, payload),

  // Config
  enableVisualizer: () => RNHeap.enableVisualizer(),
  changeInterval: (interval) => RNHeap.changeInterval(interval),
};


export default guard(Heap);
