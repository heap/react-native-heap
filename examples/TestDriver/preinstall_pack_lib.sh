#!/bin/bash

# Pack the RN bridge npm module into a tar.gz so we can install from the local
# package folder without symlinks.

npm pack ../..
