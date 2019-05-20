# react-native-heap

[![npm](https://img.shields.io/npm/v/@heap/react-native-heap.svg)](https://www.npmjs.com/package/@heap/react-native-heap)
[![npm](https://img.shields.io/npm/dt/@heap/react-native-heap.svg)](https://www.npmjs.com/package/@heap/react-native-heap)
[![npm](https://img.shields.io/npm/l/@heap/react-native-heap.svg)](https://github.com/heap/react-native-heap/blob/master/LICENSE)

React Native tracker for [Heap](https://heapanalytics.com).

## Getting Started

```bash
npm install @heap/react-native-heap
```

For autotrack, add the following plugins to your `.babelrc` or `babel.config.js` file (not required for manual tracking):

```json
{
  "plugins": [
    "add-react-displayname",
    "./node_modules/@heap/react-native-heap/instrumentor/src/index.js"
  ]
}
```

## Installation & Setup

- [iOS](docs/ios-setup.md)
- [Android](docs/android-setup.md)

## Usage

```js
// Import Heap.
import Heap from '@heap/react-native-heap';

// Start Heap if not using auto-initialization.
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

## Acknowledgements

Thank you to [Mark Miyashita](https://github.com/negativetwelve) for creating [negativetwelve/react-native-heap-analytics](https://github.com/negativetwelve/react-native-heap-analytics), which was the initial basis for this library!
