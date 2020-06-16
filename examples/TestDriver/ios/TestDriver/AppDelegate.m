/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "Heap.h"

@implementation AppDelegate

+ (void)load {
  // Send events to local collector.
  SEL setRootUrlSelector = @selector(setRootUrl:);
  if ([[Heap class] respondsToSelector:setRootUrlSelector]) {
    [[Heap class] performSelector:setRootUrlSelector withObject:@"http://localhost:3000"];
  }

  // Set timer interval shorter so tests complete in a reasonable amount of time!
  SEL changeIntervalSelector = @selector(changeInterval:);
  if ([[Heap class] respondsToSelector:changeIntervalSelector]) {
    [[Heap class] performSelector:changeIntervalSelector withObject:@1.0];
  }
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"TestDriver"
                                            initialProperties:nil];

  // Suppress native iOS events to make pixels smaller, reducing flakiness.  See https://github.com/heap/react-native-heap/pull/144.
  [rootView setValue:@true forKey:@"heapIgnore"];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
