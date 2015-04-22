var express = require('express'),
  mongoose = require('mongoose'),
  compression = require('compression'),
  favicon = require('serve-favicon'),
  winston = require('express-winston'),
  morgan = require('morgan'),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  flash = require('connect-flash'),
  connectJadeStatic = require('connect-jade-static');

var winstonLogger = require('./logging');
var store = require('./store');
var sessionInit = require('./session');

module.exports = function(app, config, router) {
  var jadeStatic = connectJadeStatic({
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
    store: store.sessionStore(session),
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
  app.use(winston.logger({
    winstonInstance: winstonLogger.forExpress,
    statusLevels: true
  }));
  app.use(sessionConfig.cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  sessionInit(app, session, sessionConfig);
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    var configRewrite = ['jsModulesPath', 'withGoogleAnalytics', 'withInspectlet', 'cacheBustingVersion'];
    configRewrite.map(function(what) {
      req[what] = config[what];
    });
    next();
  });
  app.use(router);

  return sessionConfig;
};
