#!/usr/bin/env node

var exec = require('../fsExecutor/executor.js');
exec('exec_elm', [
  ['echo', 'Installing dependencies...'],
  ['yarn'],
  ['echo', 'Building...'],
  ['node_modules/.bin/elm-make', '--yes', '--warn', 'Main.elm', '--output', 'index.html'],
  ['rm', '-rf', 'node_modules']
], {
  PATH: `${process.env.PATH};${process.env.NVM_DIR}`
}, [
  // Cleanup command
  ['rm', '-rf', 'node_modules'],
]);

