var watcher = require('./watcher');
var jsondiff = require('jsondiffpatch');

function asObject(x) {
  if (!x) {
    return {};
  }
  return x.toObject();
}

var x = watcher(process.cwd());
x.on('model', function(oldModel, newModel) {
  var oldM = asObject(oldModel);
  var newM = asObject(newModel);

  var diff = jsondiff.diff(oldM, newM);
  console.dir(diff);

});
