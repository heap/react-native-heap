//
//  Heap.h
//  Version 5.1.0
//  Copyright (c) 2014 Heap Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

// Makes nonnull annotation default everywhere. We can explicitly annotate with
// nullable if necessary. This makes Swift use non-optional types instead of
// implicitly unwrapped optionals.
NS_ASSUME_NONNULL_BEGIN

/// @name Heap library

/// The Heap API.
@interface Heap : NSObject

/// @name Developer methods

/// Return the version number of the Heap library.
+ (NSString * const)libVersion;

/**
 * Set the app ID for your project, and begin tracking events automatically.
 *
 * @param newAppId       the Heap app ID
 */
+ (void)setAppId:(NSString *)newAppId;

/**
 * Enable the Event Visualizer to allow defining events in Heap.
 *
 * This should not be called in the release version of an app.
 *
 * @see [Event visualizer for iOS apps](https://heapanalytics.com/docs/define-events#visualizer-for-ios-apps)
 */
+ (void)enableVisualizer;

/**
 * Start debug logging of Heap activity via NSLog.
 *
 * This should not be called in the release version of an app.
 */
+ (void)startDebug;

/**
 * Stop debug logging.
 */
+ (void)stopDebug;

/**
 * Change the frequency at which data is sent to Heap.
 *
 * The default is 15 seconds. A shorter interval may result in increased power
 * consumption.
 *
 * @param interval     number of seconds between pushing events to Heap
 */
+ (void)changeInterval:(double)interval;


/// @name User identities and properties

/// Return the Heap-generated user ID of the current user.
+ (NSString * const)userId;

/**
 * Attach a unique identifier to a user.
 *
 * If you assign the same identity to a user on a separate device, their past
 * sessions and event activity will be merged into the existing Heap user with
 * that identity.
 *
 * The identity must be no longer than 255 characters.
 *
 * @param identity     case-sensitive string that uniquely identifies a user
 *
 * @see addUserProperties:
 * @see [User identities and properties](https://heapanalytics.com/docs/using-identify)
 */
+ (void)identify:(NSString *)identity;

/**
 * Attach custom properties to user profiles.
 *
 * User properties are associated with all of the user's past activity, in
 * addition to their future activity. Custom user properties can be queried in the
 * same fashion as any other user property.
 *
 * Examples include account-level info from your database, A/B test data, or
 * demographic info.
 *
 * Keys and values must be a numbers or strings with fewer than 1024 characters.
 * The string user_id cannot be used as a key in the user properties object.
 *
 * @param properties    key-value pairs to be associated with a user
 *
 * @see identify:
 * @see [User identities and properties](https://heapanalytics.com/docs/using-identify)
 */
+ (void)addUserProperties:(NSDictionary *)properties;


/// @name Custom events

/**
 * Track a custom event.
 *
 * The event name is limited to 1024 characters.
 *
 * @param event        the event name
 *
 * @see track:withProperties:
 * @see [track in Heap documentation](https://heapanalytics.com/docs/custom-api#track)
 */
+ (void)track:(NSString *)event;

/**
 * Track a custom event with properties.
 *
 * The event name is limited to 1024 characters. Keys and values must be a
 * numbers or strings with fewer than 1024 characters.
 *
 * @param event        the event name
 * @param properties   key-value pairs to associate with the event
 *
 * @see track:
 * @see [track in Heap documentation](https://heapanalytics.com/docs/custom-api#track)
 */
+ (void)track:(NSString *)event withProperties:(nullable NSDictionary *)properties;


/// @name Global event properties

/**
 * Specify global key-value pairs to attach to all of a user's subsequent events.
 *
 * These event properties will persist across multiple sessions on the same
 * device and get applied to both auto-captured and custom events. This is
 * useful if you have some persistent state, but you don't want to apply it
 * across all of a user's events with identify.
 *
 * A good example is "Logged In", which changes over the user's lifecycle. You
 * can use addEventProperties to measure how a user's behavior changes when
 * they're logged in vs. when they're logged out.
 *
 * @param properties   key-value pairs to associate with future events
 *
 * @see removeEventProperty:
 * @see clearEventProperties
 */
+ (void)addEventProperties:(NSDictionary *)properties;
/**
 * Stops a single event property from getting attached to all subsequent events.
 *
 * @param property     the name of the property remove
 *
 * @see addEventProperties:
 * @see clearEventProperties
 */
+ (void)removeEventProperty:(NSString *)property;

/**
 * Remove all properties added with addEventProperties:.
 *
 * @see addEventProperties:
 * @see removeEventProperty:
 */
+ (void)clearEventProperties;


/// @name Deprecated methods

/// Alias for addEventProperties:.
+ (void)setEventProperties:(NSDictionary *)properties __deprecated_msg("Use addEventProperties instead");
/// Alias for removeEventProperty:.
+ (void)unsetEventProperty:(NSString *)property __deprecated_msg("Use removeEventProperty instead");

@end
NS_ASSUME_NONNULL_END
