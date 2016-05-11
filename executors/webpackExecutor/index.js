#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_webpack', [
  ['npm i'],
  ['./node_modules/bin/webpack']
]);

