var express = require('express'),
    mongoose = require('mongoose');

var PORT = 2000;

var config = require('../../platform/config/config');

var app = express();

app.use(express.logger('dev'));
app.use(express.cookieParser('secret'));
app.use(express.cookieSession({cookie: {maxAge: 1000 * 60 * 60 * 24}}));
app.use(express.methodOverride());
app.use(app.router);

mongoose.connect(config.db);

require('./config')(app, express);

app.get('/', function(req, res) {
    res.redirect('/admin');
});

var server = app.listen(PORT, function () {
    console.log('serve listening on port: ' + PORT);
});



