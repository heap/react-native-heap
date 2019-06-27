# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
