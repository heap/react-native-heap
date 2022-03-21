#!/bin/bash

HEAP_DIR="../../../../../heap/tracker/ios"
PODS_DIR="Pods"

pushd "${HEAP_DIR}/scripts"
HEAP_VERSION=$(./get_heap_version.rb)
popd

pushd "${HEAP_DIR}"
bundle exec fastlane ios package_heap
popd

rm -rf "${PODS_DIR}/Heap/Heap.xcframework"
cp -r "${HEAP_DIR}/build/heap-ios-${HEAP_VERSION}/Heap.xcframework" "${PODS_DIR}/Heap"
