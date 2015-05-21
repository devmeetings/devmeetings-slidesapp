var r = require;
var cwd = process.cwd();
var ipc = require('ipc');

window.watcher = {

  watch: function(cb) {
    ipc.send('watch');
    ipc.on('change', cb);
  },

  stop: function() {
    ipc.send('stop');
  }

};
