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

Finally, import the package and add it to your app's MainApplication:

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
