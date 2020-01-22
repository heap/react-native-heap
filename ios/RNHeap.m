//
//  RNHeap.m
//

#import "RNHeap.h"
#import "Heap.h"


@implementation RNHeap

RCT_EXPORT_MODULE();

static BOOL pageViewSent = NO;
static BOOL appIdSet = NO;

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(setAppId:(NSString *)appId) {
    // The Heap library stops sending events if setAppId is called twice, which
    // is often the case if you reload javascript during development.  We should
    // fix that behavior in the library, but this will prevent the issue until
    // that's updated.
    // TODO: Remove this check when the iOS tracker allows setAppId to be called multiple times.
    if (!appIdSet) {
        [Heap setAppId:appId];
        appIdSet = YES;
    } else {
        NSLog(@"The appId was already set - ignoring repeated call.");
    }
}

RCT_EXPORT_METHOD(autocaptureEvent:(NSString *)event withProperties:(NSDictionary *)properties) {
  [self checkForPageview];

  [Heap frameworkAutocaptureEvent:event withSource:@"react_native" withSourceProperties:properties];
}

RCT_EXPORT_METHOD(manuallyTrackEvent:(NSString *)event withProperties:(NSDictionary *)properties withContext:(NSDictionary *)contextProperties) {
  [self checkForPageview];

  [Heap frameworkTrack:event withProperties:properties withSource:@"react_native" withSourceProperties:contextProperties];
}

-(void) checkForPageview {
    // The Heap library requires that a "page view" event be sent first, since properties
    // will get copied down to manual events.  Unfortunately, the first page view happens
    // before any JS code is run, and so the app doesn't yet have an ID.  This unfortunate
    // snippet makes sure that a page view gets sent first.
    #pragma clang diagnostic push
    #pragma clang diagnostic ignored "-Wundeclared-selector"
    #pragma clang diagnostic ignored "-Warc-performSelector-leaks"
    if (!pageViewSent) {
        SEL logPageviewSelector = @selector(logPageview:);
        if ([[Heap class] respondsToSelector:logPageviewSelector]) {
            [[Heap class] performSelector:logPageviewSelector withObject:@{@"type": @"react-native"}];
        }
        pageViewSent = YES;
    }
    #pragma clang diagnostic pop
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
