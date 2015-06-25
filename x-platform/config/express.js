var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var winston = require('express-winston');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var flash = require('connect-flash');
var connectJadeStatic = require('connect-jade-static');

var winstonLogger = require('./logging');
var store = require('./store');
var sessionInit = require('./session');

module.exports = function (app, config, router) {
  var jadeStatic = connectJadeStatic({
    baseDir: path.join(config.root, 'public'),
    baseUrl: '/static',
    jade: {
      pretty: true
    }
  });

  var sessionConfig = {
    key: config.cookieName || 'new_xpla.sid',
    resave: false,
    saveUninitialized: false,
    secret: 'ImSecretAndIKnowIt',
    store: store.sessionStore(session),
    cookie: {
      domain: config.cookieDomain,
      /*
       *  TODO [ToDr] We cannot use secure cookie :(
       *  The reason for this are unsafe.* domains that
       *  cannot require from you logging one more time
       */
      secure: false,
      httpOnly: true
    },
    cookieParser: cookieParser
  };

  app.use(compression());
  app.use(config.staticsPath, function (req, res, next) {
    if (req.originalUrl.indexOf('.html') === req.originalUrl.length - 5) {
      return jadeStatic(req, res, next);
    }
    return next();
  });
  app.use(config.staticsPath, express.static(config.root + '/public'));
  app.use('/cdn', express.static(config.root + '/public/cdn'));
  app.get(config.staticsPath + '/*|/cdn/*', function (req, res) {
    res.sendStatus(404);
  });
  app.set('port', config.port);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');
  app.use(favicon(config.root + '/public/images/xplatform-icon.png'));
  app.use(winston.logger({
    meta: !config.isDev,
    winstonInstance: winstonLogger.forExpress,
    expressFormat: true,
    statusLevels: true
  }));
  app.use(sessionConfig.cookieParser(sessionConfig.secret, sessionConfig.cookie));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  sessionInit(app, session, sessionConfig);
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function (req, res, next) {
    var configRewrite = ['jsModulesPath', 'withGoogleAnalytics', 'withInspectlet', 'cacheBustingVersion', 'version', 'isDev'];
    configRewrite.map(function (what) {
      req[what] = config[what];
    });
    next();
  });
  app.use(router);

  app.use(winston.errorLogger({
    winstonInstance: winstonLogger.forExpress,
    dumpExceptions: true,
    showStack: true
  }));

  return sessionConfig;
};
