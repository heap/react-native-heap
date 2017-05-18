# react-native-heap-analytics

React Native wrapper for [Heap Analytics](https://heapanalytics.com).

## Setup

```bash
# Yarn
yarn add react-native-heap-analytics

# NPM
npm install --save react-native-heap-analytics
```

### iOS with Cocoapods

Add the following to your Podfile:

```ruby
pod "react-native-heap-analytics", path: "../node_modules/react-native-heap-analytics"
```

Then run:

```bash
pod install
```

You're done! :tada:

### Android

Run the following:

```bash
react-native link react-native-heap-analytics
```

TODO(mark): Add maven repository information.


## Usage

```js
// Import Heap.
import Heap from 'react-native-heap-analytics';

// Start Heap.
Heap.setAppId('my-app-id');

// Identify your user.
Heap.identify('123456');
Heap.addUserProperties({name: "John", age: 54});

// Add event properties (these persist across sessions).
Heap.addEventProperties({isLoggedIn: true});

// You can remove a specific property or clear everything.
Heap.removeEventProperty('isLoggedIn');
Heap.clearEventProperties();

// To track an event, use:
Heap.event('signed-up', {isPaid: true, amount: 20});

// Other methods exposed:
Heap.enableVisualizer();

// Amount of second Heap waits before flushing the events.
Heap.changeInterval(10);
```

If a method is missing from the official SDK, please send a PR!
