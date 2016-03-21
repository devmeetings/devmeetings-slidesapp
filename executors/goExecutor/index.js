#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_go', [
  ['go', 'build', 'index.go'],
  ['./index']
]);

