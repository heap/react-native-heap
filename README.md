# react-native-heap

[![npm](https://img.shields.io/npm/v/@heap/react-native-heap.svg)](https://www.npmjs.com/package/@heap/react-native-heap)
[![npm](https://img.shields.io/npm/dt/@heap/react-native-heap.svg)](https://www.npmjs.com/package/@heap/react-native-heap)
[![npm](https://img.shields.io/npm/l/@heap/react-native-heap.svg)](https://github.com/heap/react-native-heap/blob/master/LICENSE)

React Native tracker for [Heap](https://heapanalytics.com).

## Getting Started

```bash
npm install @heap/react-native-heap
```

We will be supporting `npm link` in a future release. Please follow the manual setup instructions below for the time being.

### Manual setup - iOS with Cocoapods

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

### Manual setup - Android

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

## Usage

```js
// Import Heap.
import Heap from '@heap/react-native-heap';

// Start Heap.
Heap.setAppId('my-app-id');

// Identify your user.
Heap.identify('123456');
Heap.addUserProperties({ name: 'John', age: 54 });

// Add event properties (these persist across sessions).
Heap.addEventProperties({ isLoggedIn: true });

// You can remove a specific property or clear everything.
Heap.removeEventProperty('isLoggedIn');
Heap.clearEventProperties();

// To track an event, use:
Heap.track('signed-up', { isPaid: true, amount: 20 });
```

## Troubleshooting

### iOS Build Issues
**Build failures due to file not found errors**
Build failures may occur if your Podfile does not specify the path to your local React pod, which should be added (and any other necessary subspecs) to your Podfile. You can find more information (and an example) in the [official React Native docs](https://facebook.github.io/react-native/docs/integration-with-existing-apps#configuring-cocoapods-dependencies). Failing to do so will result in the `pod install` step installing an additional React dependency (version 0.11 by default). You can confirm if correct React version is being used in Podfile.lock.


## Acknowledgements

Thank you to [Mark Miyashita](https://github.com/negativetwelve) for creating [negativetwelve/react-native-heap-analytics](https://github.com/negativetwelve/react-native-heap-analytics), which was the initial basis for this library!
