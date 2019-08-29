import { NativeModules } from 'react-native';

const RNHeap = NativeModules.RNHeap;

export default class Wrapper {
    track = (event, payload) => RNHeap.track(event, payload);
    setAppId = (appId) => RNHeap.setAppId(appId);
    identify = (identity) => RNHeap.identify(identity);
    resetIdentity = () => RNHeap.resetIdentity();
    addUserProperties = (payload) => RNHeap.addUserProperties(payload);
    addEventProperties = (payload) => RNHeap.addEventProperties(payload);
    removeEventProperty = (property) => RNHeap.removeEventProperty(property);
    clearEventProperties = () => RNHeap.clearEventProperties();
}