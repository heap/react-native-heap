#!/bin/bash

# Remove the package-lock.json file, as the SHA hash for @heap/react-native-heap
# will be out of date with our current code, and so it may magically (and frustratingly)
# install a new version.  Also get rid of any tarballs left over from previous runs so we
# can rule out a stale code install from an old file.

rm package-lock.json || true
rm heap-react-native-heap-*.tgz || true

# Remove the existing installation of heap-react-native.
rm -rf node_modules/@heap || true

# Pack the RN bridge npm module into a tar.gz so we can install from the local
# package folder without symlinks.

npm pack ../..
