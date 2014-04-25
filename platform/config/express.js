var express = require('express');
var passport = require('passport');
var lessMiddleware = require('less-middleware');
var path = require('path');

module.exports = function(app, config) {
    var jadeStatic = require('connect-jade-static')({
        baseDir: path.join(config.root, 'public'),
        baseUrl: '/static',
        jade: {
            pretty: true
        }
    });

    app.configure(function() {
        app.use(express.compress());
        app.use(config.staticsPath, lessMiddleware(config.root + '/public', {
            dest: config.root + '/bin/css'
        }));
        app.use(config.staticsPath, function(req, res, next) {
            if (req.originalUrl.indexOf('.html') === req.originalUrl.length - 5) {
                return jadeStatic(req, res, next);
            }
            return next();
        });
        app.use(config.staticsPath + '/css', express.static(config.root + '/bin/css/css'));
        app.use(config.staticsPath, express.static(config.root + '/public'));
        app.set('port', config.port);
        app.set('views', config.root + '/app/views');
        app.set('view engine', 'jade');
        app.use(express.favicon(config.root + '/public/img/favicon.ico'));
        app.use(express.logger('dev'));
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session({ secret: 'ImSecretAndIKnowIt' }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(function(req, res) {
            res.status(404).render('404', {
                title: '404'
            });
        });
    });
};