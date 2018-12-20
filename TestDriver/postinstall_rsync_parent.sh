#!/bin/bash

# The Metro bundler doesn't follow symlinks, so adding a link to the
# parent project won't actually include it in the RN bundle.

# Remove the existing symlink
rm node_modules/react-native-heap-analytics

# Create a new directory
mkdir node_modules/react-native-heap-analytics

rsync -av \
  --exclude='node_modules' \
  --exclude='TestDriver' \
  --exclude='.git' \
  ../ \
  node_modules/react-native-heap-analytics
