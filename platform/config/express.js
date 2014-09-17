var express = require('express'),
    passport = require('passport'),
    lessMiddleware = require('less-middleware'),
    path = require('path'),
    stream = require('connect-stream');

var MongoStore = require('connect-mongo')(express);

module.exports = function(app, config) {
    var jadeStatic = require('connect-jade-static')({
        baseDir: path.join(config.root, 'public'),
        baseUrl: '/static',
        jade: {
            pretty: true
        }
    });

    var sessionConfig = {
        key: 'xplatform.sid',
        cookie: { 
            domain: config.cookieDomain,
            path: '/', 
            httpOnly: true, 
            secure: config.cookieSecure || false, 
            maxAge: null 
        },
        secret: 'ImSecretAndIKnowIt',
        store: new MongoStore({
            url: config.db
        }),
        cookieParser: express.cookieParser
    };

    app.configure(function() {
        app.use(express.compress());
        app.use(config.staticsPath, function(req, res, next) {
            if (req.originalUrl.indexOf('.html') === req.originalUrl.length - 5) {
                return jadeStatic(req, res, next);
            }
            return next();
        });
        app.use(config.staticsPath, express.static(config.root + '/public'));
        //app.use(stream(config.root + '/public'), {
        //cache: false
        //});
        //app.use(config.staticsPath, function(req, res, next) {
        //res.stream(req.url);
        //});
        app.set('port', config.port);
        app.set('views', config.root + '/app/views');
        app.set('view engine', 'jade');
        app.use(express.favicon(config.root + '/public/img/favicon.ico'));
        app.use(express.logger(config.logger));
        if (config.graylog) {

            var expressWinston = require('express-winston'),
                Graylog2 = require('winston-graylog2').Graylog2;
            app.use(expressWinston.logger({
                transports: [
                    new Graylog2({
                        graylogHost: config.graylog.host,
                        graylogPort: config.graylog.port
                    })
                ]
            }));
        }
        app.use(sessionConfig.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session(sessionConfig));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(express.methodOverride());
        app.use(function(req, res, next) {
            var configRewrite = ['jsModulesPath', 'doLiveReload', 'withGoogleAnalytics', 'withInspectlet', 'cacheBustingVersion'];
            configRewrite.map(function(what) {
                req[what] = config[what];
            });
            next();
        });
        app.use(app.router);
        app.use(function(req, res) {
            res.status(404).render('404', {
                title: '404'
            });
        });
    });

    return sessionConfig;
};