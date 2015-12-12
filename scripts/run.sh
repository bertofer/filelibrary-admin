#!/bin/sh
cd /app/ && gulp prepare-client
cd /app/ && node --harmony server/index.js #to change by pm2 in the future
