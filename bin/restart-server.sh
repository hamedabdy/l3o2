#!/bin/bash

# Install package.json
echo -e "\n#### INSTALLING LIBS"
npm install

# Invoke the Forever module (to STOP our Node.js server).
echo "#### STOPING NODEJS SERVER..."
./node_modules/forever/bin/forever stop server.js

# Invoke the Forever module (to START our Node.js server).
mkdir -p logs

echo -e "\n#### STARTING NODEJS SERVER"
./node_modules/forever/bin/forever \
start \
-al forever.log \
-ao logs/out.log \
-ae logs/err.log \
server.js

echo ""
