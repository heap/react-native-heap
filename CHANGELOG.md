# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.22.6] - 2023-11-03

### Fixed

- Fixed issue that prevents events from being sent when the navigator is not initialized.

- Fixed linking and auto-initialization when using `use_frameworks!`.

### Changed

- Error logging has been refined to surface more timely and precise messages.

## [0.22.5] - 2023-09-26

### Fixed

- `Heap.withHeapNavigationWrapper` returns the same object when called
  multiple times, preventing app refreshes when used within a
  re-evaluated function like `App` with `useEffect`.

- The typescript definition for `<HeapIgnore/>` has been updated to support
  React 18.

- Podspec now produces a stable checksum in Podfile.lock across machines.

## [0.22.4] - 2023-09-05

### Fixed

 - Fixed `<Switch>` change event capture on React Native 0.66 and later.

## [0.22.3] - 2023-06-29

### Fixed

 - Removed unnecessary expo dependency that had a critical vulnerability.

## [0.22.2] - 2023-04-04

### Fixed

 - Updated podspec to work with Ruby 3.2.

## [0.22.1] - 2022-12-02

### Changed

 - Switched repositories from jcenter to mavenCentral.

### Fixed

 - Fixed Android compilation, moving log to `RNLog.w`.

## [0.22.0] - 2022-09-23

### Added

 - Added tests for sending bad data to the native bridge

### Changed

 - Changed track bridge to warn instead of throw an exception when bad data is sent.
 - Upgraded iOS sdk from 8.2 to 9.0

## [0.21.0] - 2022-06-29

### Added

- Added `getSessionId()` method for fetching the current Heap Session ID from the underlying native SDK.
- Added Expo config plugin to support Android in managed workflows.

## [0.20.0] - 2022-04-28

### Changed
- Upgraded the Android library to use Heap version 1.10.+.

### Fixed

- Fixed type definition for `withReactNavigationAutotrack` on React Navigation 6.

## [0.19.0] - 2022-04-12

### Added

- Added support for Event Visualizer on iOS, with a pairing option in the React Native developer menu.
- Added iOS-only option to enable Heap SDK debug logging in the iOS console, enabled by default on dev builds.
- Disabled tracking of view controllers on iOS when `enableNativeTouchEventCapture` is off.

### Changed

- Updated `Heap.setAppId` on iOS to turn off native touch capture on iOS.
- Updated `Heap.setAppId` on iOS to enable logging on debug builds.

## [0.18.0] - 2022-02-28

### Fixed

- Fixed iOS build in folders with spaces.
- Fixed minSdkVersion build error on React Native 0.64+.

## [0.17.1] - 2021-12-01

### Fixed

- Hotfix for misconfigured iOS event uploads.

## [0.17.0] - 2021-11-09

### Changed

- iOS now consumes the Heap sdk via CocoaPods, linking to versions 8.0.0 and above, but not 9.0.0.
- Upgraded the Android library to use 1.9.+.

### Fixed

- Linked heap-ios-sdk now supports development on M1 Macs.
- Fixed performance issue on iOS where Heap would scan the native view hierarchy despite native touch autocapture being disabled.
- Improved TypeScript definitions.
- Fixed a path issue in the podspec.

### Removed
- Support for manually linking Heap on iOS.
- Support for versions below React Native v0.63.

## [0.17.0-alpha1] - 2021-06-09
### Fixed
- Fixed sporadic Babel instrumentation (`Cannot read property 'end' of null`) issues

## [0.16.0] - 2021-06-01
### Added
- Added support for React 17 (resolves #241).

## [0.15.0] - 2021-05-04
### Added
- Added support for `Pressable` components (introduced in React Native v0.63) via HOC instrumentation.

### Changed
- Upgraded the native Heap iOS (7.5.0) and Android (1.9.1) libraries

## [0.14.0] - 2020-09-23
### Added
- Added 'enableNativeTouchEventCapture' config option that controls whether the native iOS SDK captures touch-like events.

### Changed
- Upgraded the native Heap iOS SDK dependency to 7.2.0.

### Fixed
- Fixed bug that broke ref-forwarding on `TextInput` components on React Native v0.62+.

## [0.13.0] - 2020-08-31

### Added
- Added support for `Touchable` components in React Native v0.62+ via HOC instrumentation.
- Added support for `TextInput` components in React Native v0.62+ via HOC instrumentation.
- Added support for React Navigation 5.

## [0.12.0] - 2020-06-22

### Changed
- Upgraded the native Heap iOS SDK dependency to 6.8.1. This fixes an issue in which Install/Upgrade events would not fire for some installations

### Fixed
- Improve support for 'HeapIgnore' and its convenience components in minified apps.
- Updated `index.d.ts` typings to include `HeapIgnore` and related components.

## [0.11.0] - 2020-04-10

### Changed
- Upgraded the native Android Heap SDK to v1.6.0.
- Upgraded Heap iOS SDK dependency to 6.7.0.

### Fixed
- Updated `index.d.ts` typings to include `resetIdentity()` and `getUserId()` methods.

## [0.10.0] - 2020-01-21

### Added
- Added `getUserId()` method for fetching the current Heap User ID from the underlying native SDK.

## [0.9.1] - 2019-12-20

### Fixed
- Fixed bug where app would crash when `Heap.track()` is called if React Navigation autocapture isn't set up. [#165](https://github.com/heap/react-native-heap/issues/165).
- Strip additional special characters from props and component names to prevent hierarchy matching/parsing breakages.
- Upgraded Heap iOS SDK dependency to 6.5.3 to pick up bug fixes since version 6.5.0.
- Don't crash when capturing props with circular references or React JSX elements.

## [0.9.0] - 2019-12-05

### Changed
- Updated the way events are sent to the Heap backend to allow for first-class support of React Native as a library.  See [the upgrade guide](https://docs.heap.io//docs/migrating-legacy-react-native-events-for-heap-090) for details.
- Upgraded the native Android Heap SDK to v1.3.0.
- Upgraded vendored iOS Heap library to 6.5.1.
- Updated higher-order components to use display name conventions (described [here](https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)).

### Fixed
- Fixed React Navigation autocapture when [manual screen tracking](https://reactnavigation.org/docs/en/screen-tracking.html) is also used.

## [0.8.0] - 2019-08-26

### Added
- Autocapture of changes to React Native `TextInput` components.

### Fixed
- Fixed bug where the iOS build would fail in an obscure way when the `prod` or `dev` field is missing from `heap.config.json`.

## [0.7.1] - 2019-08-15

### Fixed
- Upgraded vendored iOS Heap library to 6.2.1, which fixed an issue where user IDs were not being reused across sessions in some cases.
- Now using proper ref forwarding for HeapIgnore HOC.

## [0.7.0] - 2019-08-07

### Added
- `resetIdentity` method for resetting an identified user to an anonymous user.

### Changed
- Updated sessionization semantics; sessions now expire after 5 idle minutes, regardless of the app's background/foreground state.

### Fixed
- Fixed bug on RN 0.60.4 in which `ScrollView` instrumentation breaks the component. [#119](https://github.com/heap/react-native-heap/issues/119)

## [0.6.0] - 2019-07-24

### Added
- React Navigation screen name + route path properties on autocaptured events.

### Fixed
- Fixed bug where iOS settings script might fail when the dev is using `rvm` or `rbenv` to manage Ruby versions. (@marcferna)

## [0.5.1] - 2019-07-03

### Fixed
- Fixed bug where re-rendered React Navigation containers wrapped with the React Navigation HOC would cause a "Cannot read property 'nav' of null" error.

## [0.5.0] - 2019-06-27

### Added
- Autocapture of paging events on React Native `ScrollView` components with `pagingEnabled`.
- Added automatic property capture for NativeBase and React Native Elements component libraries.

### Fixed
- Ref-forwarding on the React Navigation HOC

## [0.4.0] - 2019-05-22

### Added
- Auto-initialization of Heap for both iOS and Android apps.
- Added `HeapIgnore` and `HeapIgnoreTargetText` components.

### Fixed
- Prevent Heap library errors from crashing the client app.
- Passthrough props on React Navigation autocapture HOC.

## [0.3.0] - 2019-04-23

### Added
- Autotrack for React Native and NativeBase `Switch` components.
- Android: use the parent project's version information if available. (@natethebosch)
- Use the `Navigate/INITIAL` identifier for the initial React Navigation action.
- Capture the `key` property for list items that have it set.

### Fixed
- Get Android+Detox tests working after breaking changes in a prior Detox upgrade.

## [0.2.0] - 2019-03-29

### Added

- Debug logging at startup to warn if SDK has not been properly installed or if app is not instrumented successfully
- Autotrack for React Navigation
- Capturing `testID` for every component
- (iOS) Cocoapods configuration so dynamic frameworks can be built alongside Heap.
- Autotrack Touchable events
- Configurable property capture for React hierarchy

### Fixed

- addUserProperties and addEventProperties would fail due to a missing `require`.
- Using a TypeScript build now, so everything we ship is vanilla JS. This enables compatibility with some older versions of React Native (tested back to 0.54).
- Handles the case of missing or a null properties object passed to `Heap.track`.
- Property capture configuration for functional components
- Target text capture for functional components
- Vendored native iOS libHeap.a library for manual installation.

## [0.1.1] - 2019-01-08

### Added

- Typescript bindings for manual tracking API.

## [0.1.0] - 2018-12-23

### Added

- Ability to manually track events from React Native code.
- Ability to use Heap's identity APIs from React Native code.
- Instructions for install and use.

[unreleased]: https://github.com/heap/react-native-heap/compare/0.22.6...HEAD
[0.22.6]: https://github.com/heap/react-native-heap/compare/0.22.5...0.22.6
[0.22.5]: https://github.com/heap/react-native-heap/compare/0.22.4...0.22.5
[0.22.4]: https://github.com/heap/react-native-heap/compare/0.22.3...0.22.4
[0.22.3]: https://github.com/heap/react-native-heap/compare/0.22.2...0.22.3
[0.22.2]: https://github.com/heap/react-native-heap/compare/0.22.1...0.22.2
[0.22.1]: https://github.com/heap/react-native-heap/compare/0.22.0...0.22.1
[0.22.0]: https://github.com/heap/react-native-heap/compare/0.21.0...0.22.0
[0.21.0]: https://github.com/heap/react-native-heap/compare/0.20.0...0.21.0
[0.20.0]: https://github.com/heap/react-native-heap/compare/0.19.0...0.20.0
[0.19.0]: https://github.com/heap/react-native-heap/compare/0.18.0...0.19.0
[0.18.0]: https://github.com/heap/react-native-heap/compare/0.17.1...0.18.0
[0.17.1]: https://github.com/heap/react-native-heap/compare/0.17.0...0.17.1
[0.17.0]: https://github.com/heap/react-native-heap/compare/0.17.0-alpha1...0.17.0
[0.17.0-alpha1]: https://github.com/heap/react-native-heap/compare/0.16.0...0.17.0-alpha1
[0.16.0]: https://github.com/heap/react-native-heap/compare/0.15.0...0.16.0
[0.15.0]: https://github.com/heap/react-native-heap/compare/0.14.0...0.15.0
[0.14.0]: https://github.com/heap/react-native-heap/compare/0.13.0...0.14.0
[0.13.0]: https://github.com/heap/react-native-heap/compare/0.12.0...0.13.0
[0.12.0]: https://github.com/heap/react-native-heap/compare/0.11.0...0.12.0
[0.11.0]: https://github.com/heap/react-native-heap/compare/0.10.0...0.11.0
[0.10.0]: https://github.com/heap/react-native-heap/compare/0.9.1...0.10.0
[0.9.1]: https://github.com/heap/react-native-heap/compare/0.9.0...0.9.1
[0.9.0]: https://github.com/heap/react-native-heap/compare/0.8.0...0.9.0
[0.8.0]: https://github.com/heap/react-native-heap/compare/0.7.1...0.8.0
[0.7.1]: https://github.com/heap/react-native-heap/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/heap/react-native-heap/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/heap/react-native-heap/compare/0.5.1...0.6.0
[0.5.1]: https://github.com/heap/react-native-heap/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/heap/react-native-heap/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/heap/react-native-heap/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/heap/react-native-heap/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/heap/react-native-heap/compare/0.1.1...0.2.0
[0.1.1]: https://github.com/heap/react-native-heap/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/heap/react-native-heap/releases/tag/0.1.0
