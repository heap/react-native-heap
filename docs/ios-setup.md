# Installation

## With CocoaPods

If you don't have a Podfile in the `ios` folder of your React Native project, follow this guide to create one: https://facebook.github.io/react-native/docs/integration-with-existing-apps#configuring-cocoapods-dependencies

Add the following to your Podfile:

  ```ruby
  pod "react-native-heap", path: "../node_modules/@heap/react-native-heap"
  ```

Then run:

  ```bash
  pod install
  ```

You're done! :tada:

## Without Cocoapods

All terminal commands assume you are in the top-level directory of your React Native project.

1. Locate the Xcode project for RNHeap: `open node_modules/@heap/react-native-heap/ios` . You should see a Finder window containing the `RNHeap.xcodeproj` file.
1. Open the Xcode project for your native app, in the `ios` directory of your project.
1. Drag the `RNHeap.xcodeproj` file from the Finder window into the "Libraries" group of your Xcode project.
1. Select your project name in the Xcode project navigator. Select the "Build Phases" tab for your app's target.
1. Expand the build phase called "Link Binary With Libraries". In the project navigator on the left, expand the `RNHeap.xcodeproj` entry, and find `libRNHeap.a` in the "Products" group. The icon for `libRNHeap.a` should look like a little building with columns.
1. Drag the `libRNHeap.a` file into the list of other libraries to be linked.
1. Expand the build phase called "Copy Bundle Resources". In the project navigator on the left, expand the `RNHeap.xcodeproj` entry, and find `HeapSettings.bundle`. Drag this into the list of bundle resources to be copied.

**NOTE**: Using `react-native link` is not currently supported

# Initialization

- This library needs to be initialized so events are sent to the right application/environment ID. 
Place a `heap.config.json` file at the root of your application's repository with this structure, substituting your own application/environment IDs.

  ```json
  {
    "default": {
      "heapAutoInit": true
    },
    "dev": {
      "heapAutoInit": true,
      "heapAppId": "11"
    },
    "prod": {
      "heapAppId": "12",
      "heapAutoInit": true
    }
  }
  ```

- Note that different application/environment IDs can be set for development and production. Heap can also be enabled/disabled on a per-environment basis. Values in `default` are used if a key is missing in either `dev` or `prod`.

## Manual Initialization

- If you'd like to skip auto-initialization, simply call `Heap.setAppId` with an application/environment ID.

  ```javascript
  import Heap from '@heap/react-native-heap';
  Heap.setAppId('my-app-id');
  ```

- Note that manual initialization [on Android](./android-setup.md#manual-initialization) is slightly more involved.

# Build Issues

**Build failures due to file not found errors**

Build failures may occur if your Podfile does not specify the path to your local React pod, which should be added (and any other necessary subspecs) to your Podfile. You can find more information (and an example) in the [official React Native docs](https://facebook.github.io/react-native/docs/integration-with-existing-apps#configuring-cocoapods-dependencies). Failing to do so will result in the `pod install` step installing an additional React dependency (version 0.11 by default). You can confirm if correct React version is being used in Podfile.lock.

**Linker error due to `Undefined symbols for architecture x86_64:`**

This occurs at build time, and in its entirety, looks like this in the build log:

```
Undefined symbols for architecture x86_64:
  "_OBJC_CLASS_$_Heap", referenced from:
      objc-class-ref in RNHeap.o
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

This may appear if the `Podfile` contains a `use_frameworks!` directive. One solution is to add the following at the very end of your `Podfile`:

```ruby
# Force react-native-heap to be built as a static framework.
# Based on comments at https://github.com/CocoaPods/CocoaPods/issues/7428 .
pre_install do |installer|
    pod = installer.pod_targets.find { |p| p.name == 'react-native-heap'}
    def pod.static_framework?
        true
    end
end
```