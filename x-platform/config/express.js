var express = require('express'),
  compression = require('compression'),
  favicon = require('serve-favicon'),
  winston = require('express-winston'),
  morgan = require('morgan'),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  flash = require('connect-flash');

var MongoStore = require('connect-mongo')(session);

module.exports = function(app, config, router) {
  var jadeStatic = require('connect-jade-static')({
    baseDir: path.join(config.root, 'public'),
    baseUrl: '/static',
    jade: {
      pretty: true
    }
  });

  var sessionConfig = {
    key: config.cookieName || 'xpla.sid',
    resave: false,
    saveUninitialized: false,
    secret: 'ImSecretAndIKnowIt',
    store: new MongoStore({
      url: config.db,
      touchAfter: 3600
    }),
    cookieParser: cookieParser
  };

  app.use(compression());
  app.use(config.staticsPath, function(req, res, next) {
    if (req.originalUrl.indexOf('.html') === req.originalUrl.length - 5) {
      return jadeStatic(req, res, next);
    }
    return next();
  });
  app.use(config.staticsPath, express.static(config.root + '/public'));
  app.set('port', config.port);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');
  app.use(favicon(config.root + '/public/images/xplatform-icon.png'));
  app.use(morgan(config.logger));
  if (config.graylog) {
    var Graylog2 = require('winston-graylog2').Graylog2;
    app.use(winston.logger({
      transports: [
        new Graylog2({
          graylogHost: config.graylog.host,
          graylogPort: config.graylog.port
        })
      ]
    }));
  }
  app.use(sessionConfig.cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(session(sessionConfig));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    var configRewrite = ['jsModulesPath', 'doLiveReload', 'withGoogleAnalytics', 'withInspectlet', 'cacheBustingVersion'];
    configRewrite.map(function(what) {
      req[what] = config[what];
    });
    next();
  });
  app.use(router);

  return sessionConfig;
};
