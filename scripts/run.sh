#!/bin/sh
cd ../
gulp prepare-client
node --harmony server/index.js #to change by pm2 in the future
