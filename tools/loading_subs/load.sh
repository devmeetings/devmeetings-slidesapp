#!/bin/sh

mongoimport --db platform-development --collection snapshots test/snapshots.json
node index.js
