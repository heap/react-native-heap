#import "RNHeapInit.h"
#import <Foundation/Foundation.h>
#import <Heap/Heap.h>

#ifdef DEBUG
#define SUFFIX @"Dev"
#else
#define SUFFIX @"Prod"
#endif

@implementation RNHeapInit

+ (void)load {
    NSBundle *heapBundle = [NSBundle bundleWithPath:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"HeapSettings.bundle"]];
    NSString *heapPlistPath = [heapBundle pathForResource:@"HeapSettings" ofType:@"plist"];
    NSDictionary *heapPlistData = [NSDictionary dictionaryWithContentsOfFile:heapPlistPath];
    
    NSString *appId = heapPlistData[@"HeapAppId" SUFFIX];
    BOOL enableTouchAutocapture = [heapPlistData[@"HeapEnableAutocapture" SUFFIX] boolValue];
    NSString *captureBaseUrlString = heapPlistData[@"HeapCaptureBaseUrl" SUFFIX];
    BOOL enableDebugLogging = [heapPlistData[@"HeapEnableDebugLogging" SUFFIX] boolValue];

    if (appId.length == 0) {
        NSLog(@"Not auto-initializing Heap library.");
        return;
    }

    NSURL captureBaseUrl = ? captureBaseUrlString.length > 0 ? [NSURL URLWithString:captureBaseUrlString] : nil;
    
    NSLog(@"Auto-initializing the Heap library with app ID %@ with native autocapture enabled=%@.", appId, enableTouchAutocapture ? @"true": @"false");

    [self initializeWithAppId:appId enableTouchAutocapture:enableTouchAutocapture enableDebugLogging:enableDebugLogging captureBaseUrl:captureBaseUrl];
}

+ (void)initializeWithAppId:(NSString *)appId enableTouchAutocapture:(BOOL)enableTouchAutocapture enableDebugLogging:(BOOL)enableDebugLogging captureBaseUrl:(NSURL *)captureBaseUrl
{
    static BOOL alreadyInitialized = NO;

    if (alreadyInitialized) {
        NSLog(@"Heap was already initialized. Ignoring initialize request.");
        return;
    }

    HeapOptions *options = [[HeapOptions alloc] init];
    
    if (!enableTouchAutocapture) {
        options.disableTouchAutocapture = YES;
        options.hierarchyCaptureLimit = -1;
        options.disableViewControllerAutocapture = YES;
    }
    
    if (captureBaseUrl.length > 0) {
        options.captureBaseUrl = [NSURL URLWithString:captureBaseUrl];
    }

    options.debug = enableDebugLogging;
    
    [Heap initialize:appId withOptions:options];
}

@end
