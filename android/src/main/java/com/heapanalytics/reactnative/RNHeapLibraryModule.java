package com.heapanalytics.reactnative;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.util.RNLog;
import com.heapanalytics.android.Heap;
import com.heapanalytics.android.internal.HeapImpl;

import java.util.HashMap;
import java.util.Map;

public class RNHeapLibraryModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNHeapLibraryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNHeap";
  }

  @ReactMethod
  public void setAppId(String appId) {
    // Currently, the Android tracker will refuse to initialize if it detects that
    // the bytecode hasn't been instrumented for autotrack. Until we are ready
    // to incorporate autotrack, instruct the Android tracker to skip those
    // checks.
    HeapImpl.skipInstrumentorChecks = true;
    Heap.init(this.reactContext, appId);
  }

  @ReactMethod
  public void identify(String identity) {
    Heap.identify(identity);
  }

  @ReactMethod
  public void getUserId(Promise promise) {
    promise.resolve(Heap.getUserId());
  }

  @ReactMethod
  public void getSessionId(Promise promise) { promise.resolve(Heap.getSessionId()); }

  @ReactMethod
  public void resetIdentity() {
    Heap.resetIdentity();
  }

  private Map<String, String> convertToStringMap(ReadableMap readableMap, String method) {
    if (readableMap == null) {
      return null;
    }

    Map<String, String> stringMap = new HashMap<>();
    ReadableMapKeySetIterator mapIterator = readableMap.keySetIterator();
    while (mapIterator.hasNextKey()) {
      String key = mapIterator.nextKey();
      switch (readableMap.getType(key)) {
      case Null:
        stringMap.put(key, null);
        break;
      case Number:
        stringMap.put(key, String.valueOf(readableMap.getDouble(key)));
        break;
      case Boolean:
        stringMap.put(key, String.valueOf(readableMap.getBoolean(key)));
        break;
      case String:
        stringMap.put(key, readableMap.getString(key));
        break;
      case Array:
      case Map:
        // The JS bridge will flatten maps and arrays in a uniform manner across both
        // platforms.
        // If we get them at this point, we shouldn't continue.
        RNLog.w(this.reactContext, method + " received an incompatible property named " + key + " which will be ignored. Heap only accepts JSON-compatible properties such as strings, numbers, and booleans.");
      }
    }
    return stringMap;
  }

  @ReactMethod
  public void addUserProperties(ReadableMap properties) {
    Heap.addUserProperties(convertToStringMap(properties, "Heap.addUserProperties"));
  }

  @ReactMethod
  public void addEventProperties(ReadableMap properties) {
    Heap.addEventProperties(convertToStringMap(properties, "Heap.addEventProperties"));
  }

  @ReactMethod
  public void clearEventProperties() {
    Heap.clearEventProperties();
  }

  @ReactMethod
  public void removeEventProperty(String property) {
    Heap.removeEventProperty(property);
  }

  @ReactMethod
  public void autocaptureEvent(String event, ReadableMap payload) {
    HeapImpl.frameworkAutocaptureEvent(event, "react_native", convertToStringMap(payload, "Heap.autocaptureEvent"));
  }

  @ReactMethod
  public void manuallyTrackEvent(String event, ReadableMap payload, ReadableMap contextualProps) {
    HeapImpl.frameworkTrack(event, convertToStringMap(payload, "Heap.track"), "react_native", convertToStringMap(contextualProps, "Heap.track"));
  }
}
