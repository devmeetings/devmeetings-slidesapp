#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_webpack', [
  ['echo', 'Restoring cached modules'],
  ['cp', '-r', __dirname + '/common/node_modules', '.'],
  ['cp', __dirname + '/common/cpfiles.sh', '.'],
  ['echo', 'Installing dependencies'],
  ['npm', 'i', '--no-progress'],
  ['echo', 'Building Webpack'],
  ['./node_modules/.bin/webpack'],
  ['./cpfiles.sh']
], {
  PATH: `${process.env.PATH};${process.env.NVM_DIR}`
});

