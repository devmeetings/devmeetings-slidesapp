var express = require('express'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  http = require('http'),
  socketio = require('socket.io'),
  config = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var app = express();

require('./config/express')(app, config);
require('./config/routes')(app);


var server = http.Server(app);
var io = socketio.listen(server);

require('./config/sockets')(io);

server.listen(config.port);
