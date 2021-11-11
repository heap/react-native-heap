# Installation

## With CocoaPods

If you don't have a Podfile in the `ios` folder of your React Native project, follow this guide to create one: https://facebook.github.io/react-native/docs/integration-with-existing-apps#configuring-cocoapods-dependencies

If you're **not** using `use_react_native` in your Podfile, you will need to add the following line to link the SDK.

```ruby
pod "react-native-heap", path: "../node_modules/@heap/react-native-heap"
```

Run the following to install the new dependencies:

```bash
pod install
```

You're done! :tada:

## Without Cocoapods

Heap does not currently support iOS deployment without Cocoapods.

# Configuration

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

- The library distinguishes between `dev` and `prod` builds using the [`__DEV__` variable](https://facebook.github.io/react-native/docs/javascript-environment#polyfills).

## Manual Initialization

- If you'd like finer-grained control over when the Heap library initializes, call `Heap.setAppId` with an application/environment ID. (Most users won't need to do this.)

  ```javascript
  import Heap from '@heap/react-native-heap';
  Heap.setAppId('my-app-id');
  ```

- Note that manual initialization [on Android](./android-setup.md#manual-initialization) requires additional steps.

# Build Issues

**Build failures due to file not found errors**

Build failures may occur if your Podfile does not specify the path to your local React pod, which should be added (and any other necessary subspecs) to your Podfile. You can find more information (and an example) in the [official React Native docs](https://facebook.github.io/react-native/docs/integration-with-existing-apps#configuring-cocoapods-dependencies). Failing to do so will result in the `pod install` step installing an additional React dependency (version 0.11 by default). You can confirm if correct React version is being used in Podfile.lock.
