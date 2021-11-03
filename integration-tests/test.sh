#!/bin/bash

trap "exit" INT TERM ERR
trap "kill 0" EXIT

set -o errexit
set -o nounset
set -o pipefail

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

# Build and test ios
cd ios && pod install && cd ..
npx detox build --configuration ios
npx detox test --configuration ios
