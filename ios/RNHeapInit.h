#import <Foundation/Foundation.h>

@interface RNHeapInit : NSObject
+ (void)initializeWithAppId:(NSString *)appId enableTouchAutocapture:(BOOL)enableTouchAutocapture enableDebugLogging:(BOOL)enableDebugLogging captureBaseUrl:(NSURL *)captureBaseUrl;
@end
