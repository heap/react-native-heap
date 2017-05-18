//
//  RNHeap.m
//  RNHeap
//
//  Created by Mark Miyashita on 05/17/17.
//  Copyright © 2017 Mark Miyashita. All rights reserved.
//


#import "RNHeap.h"
#import "Heap.h"


@implementation RNHeap

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(setAppId:(NSString *)appId) {
  [Heap setAppId:appId];
}

RCT_EXPORT_METHOD(enableVisualizer) {
  [Heap enableVisualizer];
}

RCT_EXPORT_METHOD(track:(NSString *)event withProperties:(NSDictionary *)properties) {
  [Heap track:event withProperties:properties];
}

RCT_EXPORT_METHOD(identify:(NSString *)identity) {
  [Heap identify:identity];
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

RCT_EXPORT_METHOD(changeInterval:(double)interval) {
  [Heap changeInterval:interval];
}

@end
