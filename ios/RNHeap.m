//
//  RNHeap.m
//

#import "RNHeap.h"
#import "RNHeapInit.h"
#import <Heap/Heap.h>

@implementation RNHeap

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(setAppId:(NSString *)appId) {
    [RNHeapInit initializeWithAppId:appId enableTouchAutocapture:NO enableDebugLogging:NO captureBaseUrl:nil];
}

RCT_EXPORT_METHOD(autocaptureEvent:(NSString *)event withProperties:(NSDictionary *)properties) {
  [Heap frameworkAutocaptureEvent:event withSource:@"react_native" withSourceProperties:properties];
}

RCT_EXPORT_METHOD(manuallyTrackEvent:(NSString *)event withProperties:(NSDictionary *)properties withContext:(NSDictionary *)contextProperties) {
  [Heap frameworkTrack:event withProperties:properties withSource:@"react_native" withSourceProperties:contextProperties];
}

RCT_REMAP_METHOD(getUserId, getUserIdWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *userId = [Heap userId];
  resolve(userId);
}

RCT_EXPORT_METHOD(identify:(NSString *)identity) {
  [Heap identify:identity];
}

RCT_EXPORT_METHOD(resetIdentity) {
  [Heap resetIdentity];
}

RCT_EXPORT_METHOD(addUserProperties:(NSDictionary *)properties) {
  [Heap addUserProperties:properties];
}

RCT_EXPORT_METHOD(addEventProperties:(NSDictionary *)properties) {
  [Heap addEventProperties:properties];
}

RCT_EXPORT_METHOD(removeEventProperty:(NSString *)property) {
  [Heap removeEventProperty:property];
}

RCT_EXPORT_METHOD(clearEventProperties) {
  [Heap clearEventProperties];
}

@end
