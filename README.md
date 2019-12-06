# react-native-heap

[![npm](https://img.shields.io/npm/v/@heap/react-native-heap.svg)](https://www.npmjs.com/package/@heap/react-native-heap)
[![npm](https://img.shields.io/npm/dt/@heap/react-native-heap.svg)](https://www.npmjs.com/package/@heap/react-native-heap)
[![npm](https://img.shields.io/npm/l/@heap/react-native-heap.svg)](https://github.com/heap/react-native-heap/blob/master/LICENSE)

React Native tracker for [Heap](https://heapanalytics.com).

## Heap Customer Support

Thanks for using Heap's React Native SDK! If you're having any issues, please reach out to customer support at <support@heap.io>. For the best service, include "React Native" in the subject and your app id or customer email address in the body. Also, feel free to file a github issue or open a PR! If you do so, be sure to include a link in your request to customer support. Our engineering team checks for new PRs and github issues and tries to respond as soon as possible.

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
See our [docs](https://docs.heap.io/docs/react-native).

## Acknowledgements

Thank you to [Mark Miyashita](https://github.com/negativetwelve) for creating [negativetwelve/react-native-heap-analytics](https://github.com/negativetwelve/react-native-heap-analytics), which was the initial basis for this library!
