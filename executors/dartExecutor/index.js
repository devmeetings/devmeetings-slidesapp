#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_dart', [
  ['echo', 'Restoring cache...'],
  ['sh', '-c', 'tar xjf /tmp/dart_cache/cache.tar.gz || true'],
  ['cp', __dirname + '/common/cpfiles.sh', '.'],
  ['cp', __dirname + '/common/cpcache.sh', '.'],
  ['echo', 'Dependencies...'],
  ['pub', 'get'],
  ['sh', '-c', './cpcache.sh &'],
  ['echo', 'Building...'],
  ['pub', 'build'],
  ['./cpfiles.sh']
], {
  PATH: `${process.env.PATH};${process.env.NVM_DIR}`
}, [
  // Cleanup command
  ['rm', '-rf', '.packages', 'packages'],
]);

