# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] 

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

## [0.1.1] - 2019-01-08

### Added

- Typescript bindings for manual tracking API.

## [0.1.0] - 2018-12-23

### Added

- Ability to manually track events from React Native code.
- Ability to use Heap's identity APIs from React Native code.
- Instructions for install and use.
