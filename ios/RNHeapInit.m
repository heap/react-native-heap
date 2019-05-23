#import "RNHeapInit.h"
#import <Foundation/Foundation.h>
#import "Heap.h"

@implementation RNHeapInit

+ (void)load {
    NSBundle *heapBundle = [NSBundle bundleWithPath:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"HeapSettings.bundle"]];
    NSString *heapPlistPath = [heapBundle pathForResource:@"HeapSettings" ofType:@"plist"];
    NSDictionary *heapPlistData = [NSDictionary dictionaryWithContentsOfFile:heapPlistPath];

    #ifdef DEBUG
        NSString *heapAppId = heapPlistData[@"HeapAppIdDev"];
    #else
        NSString *heapAppId = heapPlistData[@"HeapAppIdProd"];
    #endif

    if ([heapAppId length] > 0) {
        NSLog(@"Auto-initializing the Heap library with app ID %@.", heapAppId);
        [Heap setAppId:heapAppId];
    } else {
        NSLog(@"Not auto-initializing Heap library.");
    }
}

@end
