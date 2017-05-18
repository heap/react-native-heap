// Libraries
import {NativeModules} from 'react-native';

// Native Modules
const {RNHeap} = NativeModules;


export default {
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
