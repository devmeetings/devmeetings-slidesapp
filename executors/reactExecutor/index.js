#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_react', [
  ['cp', __dirname + '/common/fixjson.sh', '.'],
  ['./fixjson.sh'],
  ['echo', 'Restoring cached modules...'],
  ['cp', '-r', __dirname + '/common/node_modules', '.'],
  ['cp', __dirname + '/common/cpfiles.sh', '.'],
  ['echo', 'Installing dependencies...'],
  ['yarn'],
  ['echo', 'Building...'],
  ['npm run build'],
  ['rm', '-rf', 'node_modules'],
  ['./cpfiles.sh']
], {
  PATH: `${process.env.PATH};${process.env.NVM_DIR}`
}, [
  // Cleanup command
  ['rm', '-rf', 'node_modules'],
]);

