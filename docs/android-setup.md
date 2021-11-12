# Installation

Run `react-native link` to link the library.

If you are seeing runtime warnings at startup mentioning `Heap: Could not find BuildConfig`, add the
following line to the resources section of `res/values/strings.xml`:

  ```xml
   <string name="com.heapanalytics.android.buildConfigPkgName">com.your_package_name</string>
   ```

and replace `com.your_package_name` with the package name from the manifest tag in `AndroidManifest.xml`.

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

- In addition, find the `MainActivity.java` file, which is React Native's Android-specific entry point. This file is typically present in a subfolder of `android/app/src/main/java/`. Add the following imports:

  ```java
  import com.heapanalytics.reactnative.RNHeap;
  import android.os.Bundle;
  ```

- And add an `onCreate` method containing the following. If an `onCreate` method already exists, simply add the `RNHeap.init` line to it.

  ```java
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      RNHeap.init(getApplicationContext(), "<app-id>");
  }
  ```
