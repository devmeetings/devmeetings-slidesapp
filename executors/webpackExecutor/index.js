#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_webpack', [
  ['cp', '-r', __dirname + '/common/node_modules', '.'],
  ['npm', 'i'],
  ['./node_modules/.bin/webpack']
], {
  PATH: `${process.env.PATH};${process.env.NVM_DIR}`
});

