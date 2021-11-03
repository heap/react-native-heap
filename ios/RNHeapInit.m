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
    NSString *captureBaseUrl = heapPlistData[@"HeapCaptureBaseUrl" SUFFIX];
    
    if (appId.length == 0) {
        NSLog(@"Not auto-initializing Heap library.");
        return;
    }
    
    NSLog(@"Auto-initializing the Heap library with app ID %@ with native autocapture enabled=%@.", appId, @(enableTouchAutocapture));
    
    HeapOptions *options = [[HeapOptions alloc] init];
    
    options.disableTouchAutocapture = !enableTouchAutocapture;
    
    if (captureBaseUrl.length > 0) {
        options.captureBaseUrl = [NSURL URLWithString:captureBaseUrl];
    }
    
    [Heap initialize:appId withOptions:options];
}

@end
