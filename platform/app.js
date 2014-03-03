/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.uploadSlides);
app.get('/execute', routes.executeGui);
//app.post('/execute', routes.execute);
app.get('/slide', routes.slide);
app.get('/trainer', routes.trainer);
app.get('/slides-:file\::slide', routes.singleSlide);
app.get('/edit\:slides-:file', routes.sliderEdit);
app.get('/slides-:file', routes.slider);

var server = http.Server(app);
var io = require('socket.io').listen(server);
require('./routes/sockets')(io);

server.listen(app.get('port'), function() {
    console.log('Express and Socket.IO server listening on port ' + app.get('port'));
});