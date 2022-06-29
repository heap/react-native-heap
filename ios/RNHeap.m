//
//  RNHeap.m
//

#import "RNHeap.h"
#import "RNHeapInit.h"
#import <Heap/Heap.h>
#import <Foundation/Foundation.h>
#import <objc/message.h>
#import <React/RCTBridge.h>
#import <React/RCTDevMenu.h>

@interface RNHeap ()
@property (nonatomic, assign) BOOL delayPageviewsForScreenshots;
@end

@implementation RNHeap

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

/// This function delays a pageview until we think the animation has completed.
/// Since the state change fires at the start of the animation, we wait half a second for the transiton to complete.
+ (void)scheduleDelayedPageview:(void(^)(void))block
{
    double delayInSeconds = 0.5;
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC);
    dispatch_after(popTime, dispatch_get_main_queue(), block);
}

RCT_EXPORT_METHOD(setAppId:(NSString *)appId) {

#ifdef DEBUG
    BOOL enableDebugLogging = YES;
#else
    BOOL enableDebugLogging = NO;
#endif

    [RNHeapInit initializeWithAppId:appId enableTouchAutocapture:NO enableDebugLogging:enableDebugLogging captureBaseUrl:nil];
}

RCT_EXPORT_METHOD(autocaptureEvent:(NSString *)event withProperties:(NSDictionary *)properties) {
    if (self.delayPageviewsForScreenshots && [event isEqualToString:@"react_navigation_screenview"]) {
        [RNHeap scheduleDelayedPageview:^{
            [Heap frameworkAutocaptureEvent:event withSource:@"react_native" withSourceProperties:properties];
        }];
    } else {
        [Heap frameworkAutocaptureEvent:event withSource:@"react_native" withSourceProperties:properties];
    }
}

RCT_EXPORT_METHOD(manuallyTrackEvent:(NSString *)event withProperties:(NSDictionary *)properties withContext:(NSDictionary *)contextProperties) {
    [Heap frameworkTrack:event withProperties:properties withSource:@"react_native" withSourceProperties:contextProperties];
}

RCT_REMAP_METHOD(getUserId, getUserIdWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *userId = [Heap userId];
    resolve(userId);
}

RCT_REMAP_METHOD(getSessionId, getSessionIdWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *sessionId = [Heap sessionId];
    resolve(sessionId);
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

- (void)setBridge:(RCTBridge *)bridge {
    _bridge = bridge;
    
    [bridge.devMenu addItem:[RCTDevMenuItem buttonItemWithTitle:@"Pair Heap Event Visualizer" handler:^{
        [Heap startEVPairing];
        self.delayPageviewsForScreenshots = YES;
    }]];
}

@end
