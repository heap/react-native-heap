# Installation

In some cases, simply doing `react-native link` will correctly set up the tracker on Android.
However, if you encounter any issues (either with the command itself or at compile-time/run-time),
you should revert any changes made by `react-native link` and try the following steps, instead.

Add the following to your `settings.gradle`:

  ```groovy
  include ':react-native-heap'
  project(':react-native-heap').projectDir =
      new File(rootProject.projectDir, '../node_modules/@heap/react-native-heap/android')
  ```

Then add the following to `app/build.gradle`:

  ```groovy
  implementation project(':react-native-heap')
  ```

Import the package and add it to your app's MainApplication:

  ```java
  @Override
  import com.heapanalytics.reactnative.RNHeapLibraryPackage;
  ...
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new RNHeapLibraryPackage()
    );
  }
  ```

If you are seeing runtime warnings at startup mentioning `Heap: Could not find BuildConfig`, add the
following line to the resources section of `res/values/strings.xml`:

  ```xml
  <string name="com.heapanalytics.android.buildConfigPkgName">com.your_package_name</string>
  ```

and replace `com.your_package_name` with the package name from the manifest tag in `AndroidManifest.xml`.

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

- If you'd like to skip auto-initialization, call `Heap.setAppId` with an application/environment ID.

  ```javascript
  import Heap from '@heap/react-native-heap';
  Heap.setAppId('my-app-id');
  ```

- In addition, find the `MainActivity.java` file, which is React Native's Android-specific entry point. This file is typically present in a subfolder of `android/app/src/main/java/`. Add an `onCreate` method containing:

  ```java
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      RNHeap.init(getApplicationContext(), "<app-id>");
  }
  ```
- And the following imports:

  ```java
  import com.heapanalytics.reactnative.RNHeap;
  import android.os.Bundle;
  ```