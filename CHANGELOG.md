# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

__BEGIN_UNRELEASED__
## [Unreleased]
### Added
### Changed
- Updated the way events are sent to the Heap backend to allow for first-class support of React Native as a library.  See <TODO: upgrade guide link> for details.
- Upgraded the native Android Heap SDK to v1.3.0.
- Upgraded vendored iOS Heap library to 6.5.1.
- Updated higher-order components to use display name conventions (described [here](https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)).

### Deprecated
### Removed
### Fixed
- Fixed React Navigation autocapture when [manual screen tracking](https://reactnavigation.org/docs/en/screen-tracking.html) is also used.

### Security
__END_UNRELEASED__

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
