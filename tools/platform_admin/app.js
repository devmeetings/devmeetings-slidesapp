'use strict';
var Path = require('path');
var express = require('express'),
    mongoose = require('mongoose'),
    formage = require('formage'),
    nodestrum = require('nodestrum');

var config = require('../../platform/config/config');

var title = process.env.ADMIN_TITLE;
var app = exports.app = express();
var PORT = 5080;
var MONGO_URL = config.db; // "mongodb://localhost/platform-development";
mongoose.connect(MONGO_URL);

app.use(express.logger('dev'));
app.use(express.cookieParser('secret'));
app.use(express.cookieSession({cookie: {maxAge: 1000 * 60 * 60 * 24}}));
app.use(express.methodOverride());
app.use(app.router);

app.configure('development', function() {
    app.use(nodestrum.ConnectionCloser);
});

formage.serve_static(app, express);

app.configure('development', function() {
    app.locals('pretty', true);
    app.use(express.logger('dev'));
    app.use(app.router);
    app.use(express.errorHandler());
});


var admin = formage.init(app, express, require('./loader'), {
    title: title || 'Xplatform Admin',
    default_section: 'Main',
    admin_users_gui: true
});

app.get('/', function(req, res) {
    res.redirect('/admin');
});

var server = app.listen(PORT, function () {
    server.setTimeout(1000);
    console.log('Express server listening on port ', server.address().port);
});

