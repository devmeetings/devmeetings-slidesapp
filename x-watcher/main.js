var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    'node-integration': false,
    preload: __dirname + '/preload.js'
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('https://localhost:3000');

  // Open the devtools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

var ipc = require('ipc');
var watcher = null;
ipc.on('stop', function() {
  if (!watcher) {
    return;
  }
  watcher.close();
  watcher = null;
});

ipc.on('watch', function(event) {
  var parent = event.sender;
  if (watcher) {
    watcher.close();
  }
  watcher = require('./watcher')(process.cwd());

  watcher.on('model', function(oldModel, newModel) {
    parent.send('change', newModel.toObject());
  });
});
