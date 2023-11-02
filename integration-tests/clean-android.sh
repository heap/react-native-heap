#!/bin/bash

# Usage: ./clean-android.sh [DRIVER_PATH]
# 
# DRIVER_PATH is the app folder for the test.  If omitted, drivers/TestDriver063/

trap "exit" INT TERM ERR
trap "kill 0" EXIT

set -o errexit
set -o nounset
set -o pipefail

# Life is suffering.
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home

DRIVER_DIR="${1:-drivers/TestDriver063/}"

rm -rf ~/.gradle/caches || true
cd "${DRIVER_DIR}/android"
./gradlew cleanBuildCache
./gradlew clean
