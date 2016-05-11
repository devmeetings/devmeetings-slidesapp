#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_webpack', [
  ['cp', '-r', __dirname + '/common/node_modules', '.'],
  ['cp', __dirname + '/common/cpfiles.sh', '.'],
  ['npm', 'i'],
  ['./node_modules/.bin/webpack'],
  ['./cpfiles.sh']
], {
  PATH: `${process.env.PATH};${process.env.NVM_DIR}`
});

