#!/bin/bash

# Absolute Dir
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
# Parent Dir
PARENT="$(dirname "$DIR")"

# Install npm forever
#sudo npm install forever

# Invoke the Forever module (to START our Node.js server).
mkdir -p logs

./node_modules/forever/bin/forever -v \
start \
-al forever.log \
-ao logs/out.log \
-ae logs/err.log \
server.js

echo ''