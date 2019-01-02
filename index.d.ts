/**
 * `setAppId` Initializes Heap tracking and sets the app ID where you'll be sending data. It can be used to switch 
 * between projects or between your production and development environments.
 * 
 * __NOTE:__ On iOS, subsequent calls are ignored. On Android, a new session is initialized each time 
 * `setAppId` is called.
 *
 * @param appId the appId corresponding to one of your projects
 */
export function setAppId(appId: string): void;

/**
 * Send additional events to Heap.
 *
 * The properties map may be null to track an event with no properties.
 * The property map keys and values must be converted to strings, but they can be queried as numbers in Heap.
 *
 * Custom event properties can be queried in the same fashion as any other event property.
 *
 * @param event name of the custom interaction. Limited to 255 characters.
 * @param withProperties a JSON object containing key-value paiurs to be associated with an event. Keys and values
 * must be a number or string.
 */
export function track(event: string, withProperties: object): void;

/**
 * Attach a unique identity to a user.
 *
 * If you assign the same identity to a user on a separate device, their past sessions and event activity will be
 * merged into the existing Heap user with that identity.
 *
 * To better understand the client-side `identify` and `addUserProperties` APIs,
 * [take a look at our comprehensive guide.](https://docs.heapanalytics.com/docs/using-identify)
 *
 * __NOTE:__ The string you pass to heap.identify() is case sensitive. To avoid split users due to capitalization,
 * we recommend converting your identity to lowercase before sending to Heap if you are using email as the identity.
 *
 * @param identity a case-sensitive string that uniquely identifies a user, such as an email, handle, or username.
 * This means no two users in one environment may share the same identity. Must be fewer than 255 characters.
 */
export function identify(identity: string): void;

/**
 * Attach custom properties to user profiles.
 *
 * The `addUserProperties` API lets you attach custom properties to user profiles,
 * such as account-level info from your database, or demographic info.
 *
 * To better understand the client-side `identify` and `addUserProperties` APIs,
 * [take a look at our comprehensive guide.](https://docs.heapanalytics.com/docs/using-identify)
 *
 * @param properties a JSON object containing key-value pairs to be associated with a user.
 * Keys and values must be a number or string, with the value being 255 characters or fewer.
 *
 * Also, the string user_id cannot be used as a key in the user properties object.
 * For Android, the property map keys and values must be converted to strings,
 * but they can be queried as numbers in Heap.
 *
 * User properties are associated with all of the user's past activity, in addition to their future activity.
 * Custom user properties can be queried in the same fashion as any other user property.
 *
 * __Important:__ If you want to write your user's email into the builtin Email property,
 * you must send the key lowercase i.e. heap.addUserProperties({"email": `"user@example.com"`});
 * Sending an email value with a non-lowercase key will create a new property to store this data.
 */
export function addUserProperties(properties: object): void;

/**
 * Specify a set of global key-value pairs to get attached to all of a user's subsequent events.
 *
 * These event properties will persist across multiple sessions on the same device and get applied to both
 * auto-captured and custom events.
 *
 * This is useful if you have some persistent state, but you don't want to apply it across all of a user's
 * events with `addUserProperties`. A good example is "Logged In", which changes over the user's lifecycle.
 * You can use `addEventProperties` to measure how a user's behavior changes when they're logged in
 * vs. when they're logged out.
 *
 * @param properties a JSON object containing key-value pairs to be associated with
 * every subsequent event. Keys and values must be a number or string fewer than 1024 characters.
 *
 * For Android, the property map keys and values must be converted to strings,
 * but they can be queried as numbers in Heap.
 */
export function addEventProperties(properties: object): void;

/**
 * Stops a single event property from getting attached to all subsequent events.
 *
 * @param property name of the event property to remove. This stops attaching the property to all subsequent events.
 */
export function removeEventProperty(property: string): void;

/**
 * Removes all stored event properties.
 */
export function clearEventProperties(): void;

/**
 * The following functions are not available via the iOS and Android API.
 * 
 * export function enableVisualizer(): void;
 * export function startDebug(): void;
 * export function stopDebug(): void;
 * export function resetIdentify(): void;
 * export function userId(): Promise<string>;
 * export function libVersion(): Promise<string>;
 * export function changeInterval(interval: number): void;
 */
