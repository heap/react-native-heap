#!/bin/bash

trap "exit" INT TERM ERR
trap "kill 0" EXIT

set -o errexit
set -o nounset
set -o pipefail

# Life is suffering.
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jre/Contents/Home

DRIVER=TestDriver063

# Rebuild the package
rm heap-react-native-heap-*.tgz || true
npm pack ..

## Install the test scripts in the driver app.
rsync -r src tests "drivers/${DRIVER}/"
cd "drivers/${DRIVER}"

# Remove the existing installation of heap-react-native and install all.
rm -rf node_modules/@heap || true
npm install

# Prepare iOS
cd ios && pod install && cd ..

# Build both
npx detox build --configuration ios
npx detox build --configuration android

# Test both
npx detox test --configuration ios
npx detox test --configuration android

# TODO: The android test assumes there'll be a device named Pixel_5_API_30.  We should autocreate that but I've yet to get avdmanager to
# work on the command line.
