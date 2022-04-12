//
//  RNHeap.h
//

#import <React/RCTBridgeModule.h>

@interface RNHeap : NSObject <RCTBridgeModule>
@property (nonatomic, weak, readonly) RCTBridge *bridge;
@end
