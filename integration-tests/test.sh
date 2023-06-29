#!/bin/bash

# Usage: ./test.sh [DRIVER_PATH] [OPTIONS...]
# 
# DRIVER_PATH is the app folder for the test.  If omitted, drivers/TestDriver063/
# OPTIONS has the following values:
#    android      The tests will run on android.
#    ios          The tests will run on ios.
#    skip-npm     The test will skip packing `npm pack` and `npm install`.
# OPTIONS defaults to "android ios"
#
# Examples:
#    ./test.sh                               # runs android and ios tests against RN 0.63
#    ./test.sh drivers/TestDriver066         # runs android and ios tests against RN 0.66
#    ./test.sh drivers/TestDriver066 android # runs android tests against RN 0.66
#
# Command will fail if:
# - JDK 11 is not installed at the location below
# - There are no iPhone 13 simulators
# - Android Emulator named Pixel_5_API_30 is not installed
# - Node version in a new terminal is not node 16

trap "exit" INT TERM ERR
trap "kill 0" EXIT

set -o errexit
set -o nounset
set -o pipefail

# Life is suffering.
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home

DRIVER_DIR="${1:-drivers/TestDriver063/}"

TEST_ANDROID=false
TEST_IOS=false
SKIP_NPM=false

if [ $# -gt 1 ]
then

    for i in "${@:2}"
    do
        if [[ "$i" = "android" ]]; then TEST_ANDROID=true
        elif [[ "$i" = "ios" ]]; then TEST_IOS=true
        elif [[ "$i" = "skip-npm" ]]; then SKIP_NPM=true
        else
            echo "Unknown option $i"
            echo "Allowed options: android ios skip-npm"
            exit 1
        fi
    done

else
    TEST_ANDROID=true
    TEST_IOS=true
fi

echo "Running tests in $DRIVER_DIR"


if [ "$TEST_ANDROID" = true ]; then echo "... on Android"; fi
if [ "$TEST_IOS" = true ]; then echo "... on iOS"; fi
if [ "$SKIP_NPM" = true ]; then echo "... skipping NPM (pack and install)"; fi

if [ "$SKIP_NPM" = false ]
then
    echo "Repacking the framework"
    rm heap-react-native-heap-*.tgz || true
    npm pack ..
fi

echo "Syncing the tests"
rsync -r src tests "$DRIVER_DIR"
cd "$DRIVER_DIR"

if [ "$SKIP_NPM" = false ]
then
    echo "Reinstalling the framework"
    npm uninstall @heap/react-native-heap || true
    npm install ../../heap-react-native-heap-*.tgz
fi

if [ "$TEST_IOS" = true ]
then
    echo "Installing pods for iOS"
    cd ios
    pod repo update
    pod update Heap || true
    pod install
    cd ..
fi

if [ "$TEST_IOS" = true ]
then
    echo "Building iOS"
    npx detox build --configuration ios
fi

if [ "$TEST_ANDROID" = true ]
then
    echo "Building Android"
    npx detox build --configuration android
fi

if [ "$TEST_IOS" = true ]
then
    echo "Testing iOS"
    npx detox test --configuration ios
fi

if [ "$TEST_ANDROID" = true ]
then
    echo "Testing Android"
    npx detox test --configuration android
fi

# TODO: The android test assumes there'll be a device named Pixel_5_API_30.  We should autocreate that but I've yet to get avdmanager to
# work on the command line.
