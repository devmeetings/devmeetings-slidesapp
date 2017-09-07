#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_react', [
  ['cp', __dirname + '/common/fixjson.sh', '.'],
  ['cp', __dirname + '/common/cpfiles.sh', '.'],
  ['cp', __dirname + '/common/install_deps.sh', '.'],
  ['cp', __dirname + '/common/restore_deps.sh', '.'],
  ['cp', __dirname + '/common/backup_deps.sh', '.'],
  ['./fixjson.sh'],
  ['echo', 'Restoring cached modules...'],
  ['./restore_deps.sh', 'react'],
  ['echo', 'Installing dependencies...'],
  ['./install_deps.sh'],
  ['echo', 'Building...'],
  ['npm', 'run', 'build'],
  ['./backup_deps.sh', 'react'],
  ['./cpfiles.sh']
], {
  PATH: `${process.env.PATH};${process.env.NVM_DIR}`
}, [
  // Cleanup command
  ['rm', '-rf', 'node_modules'],
]);

