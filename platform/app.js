var express = require('express'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    http = require('http'),
    socketio = require('socket.io'),
    config = require('./config/config');


mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
    throw new Error('unable to connect to database at ' + config.db);
});

var plugins = require('./config/plugins');
plugins.invokePlugins('init', [config]);

var app = express();

var sessionConfig = require('./config/express')(app, config);

require('./config/mail')(app);
require('./config/routes')(app);
require('./config/passport');

var server = http.Server(app);
var io = socketio.listen(server);

require('./config/sockets')(io, sessionConfig);

console.log('Server listening on port:', config.port);
server.listen(config.port);