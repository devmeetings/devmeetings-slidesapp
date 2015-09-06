var passport = require('passport');
var multiparty = require('connect-multiparty');
var logger = require('./logging');

var shouldBeAuthenticated = function loggedIn (shouldRedirect, req, res, next) {
  if (req.user) {
    redirectIfNeeded(req, res, next);
  } else if (shouldRedirect) {
    req.session.redirect_to = req.url;
    res.redirect('/login');
  } else {
    res.sendStatus(401);
  }
};

var authorized = function (role) {
  return function (req, res, next) {
    if (req.user && req.user.acl.indexOf(role) !== -1) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
};
var authorizedForEditMode = function (role) {
  var auth = authorized(role);
  return function (req, res, next) {
    if (req.query.edit) {
      auth(req, res, next);
    } else {
      next();
    }
  };
};

var redirectIfNeeded = function (req, res, next) {
  if (req.session.redirect_to) {
    var redirect = req.session.redirect_to;
    delete req.session.redirect_to;
    res.redirect(redirect);
    return;
  }
  next();
};

var authenticateAsAnon = function (req, res, next) {
  if (req.query.anon) {
    var users = require('../app/services/users');
    users.findLocalUserByEmail('anon@todr.me', function (err, user) {
      if (err) {
        next(err);
      } else if (user) {
        req.login(user, next);
      } else {
        next();
      }
    });
  } else {
    next();
  }
};
var nonAnon = function (req, res, next) {
  if (req.user && req.user.email === 'anon@todr.me' && !req.query.anon) {
    req.logout();
  }
  next();
};

var apiAuthenticated = shouldBeAuthenticated.bind(null, false);
var authenticated = shouldBeAuthenticated.bind(null, true);

module.exports = function (app) {
  app.get('/api/xyz123config', function (req, res) {
    if (req.query.admin === 'Devmeetings1') {
      res.send(require('./config'));
    }
  });

  var slides = require('../app/controllers/slides');
  app.get('/api/slides', apiAuthenticated, slides.list);
  app.post('/api/slides', apiAuthenticated, authorized('admin:slides'), slides.create);
  app.get('/api/slides/:id', apiAuthenticated, slides.get);

  var decks = require('../app/controllers/decks');
  app.get('/api/decks', apiAuthenticated, decks.list);
  app.get('/api/decks/:id', apiAuthenticated, decks.get);
  app.post('/api/decks', apiAuthenticated, authorized('admin:slides'), decks.create);
  app.delete('/api/decks/:id', apiAuthenticated, authorized('admin:super'), decks.delete);
  app.put('/api/decks/:id', apiAuthenticated, authorized('admin:slides'), decks.edit);

  var recordings = require('../app/controllers/recordings');
  app.get('/api/recordings', apiAuthenticated, recordings.list);
  app.get('/api/recordings/:id', apiAuthenticated, recordings.get);
  app.get('/api/recordings/:id/annotations', apiAuthenticated, recordings.autoAnnotations);
  app.post('/api/recordings/:id1/join/:id2', apiAuthenticated, authorized('admin:events'), recordings.join);
  app.post('/api/events/:eventId/recordings/:id1/join/:id2', apiAuthenticated, authorized('admin:events'), recordings.joinForEvent);

  var history = require('../app/controllers/history');
  app.get('/api/history/since/:id', apiAuthenticated, history.since);
  app.post('/api/history/since/:id/recording/:from/:to/event/:eventId', apiAuthenticated, authorized('admin:events'), history.convertToRecording);
  app.get('/api/history/:id', apiAuthenticated, history.get);

  var events = require('../app/controllers/events');
  app.get('/api/events', events.all);
  app.get('/api/events/raw', function (req, res, next) {
    if (req.query.raw === 'raw') {
      next();
      return;
    }
    res.sendStatus(403);
  }, events.raw);
  app.get('/api/events/:id/_id', events.getRealId);
  app.get('/api/users/:userId/events', apiAuthenticated, events.userEvents);
  app.get('/api/events/:id', apiAuthenticated, events.get);

  var fetchEvent = require('../app/controllers/fetchEvent');
  app.post('/api/events/zip', apiAuthenticated, authorized('admin:events'), multiparty(), fetchEvent.createEventFromZip);
  app.post('/api/events', apiAuthenticated, authorized('admin:events'), events.create);
  app.put('/api/events/:id', apiAuthenticated, authorized('admin:events'), events.update);
  app.delete('/api/events/:id', apiAuthenticated, authorized('admin:events'), events.remove);
  app.post('/api/event_visibility/:event/:visible', apiAuthenticated, authorized('admin:events'), events.changeVisibility);

  app.get('/api/events/:id/annotations', apiAuthenticated, events.getAllAnnotations);
  app.get('/api/events/:id/annotations/:annotationId', apiAuthenticated, events.getAnnotations);

  app.post('/api/event_iteration_material_anno/:event/:iteration/:material', apiAuthenticated, authorized('admin:events'), events.annotationCreate);
  app.put('/api/event_iteration_material_anno/:event/:iteration/:material/:id', apiAuthenticated, authorized('admin:events'), events.annotationEdit);

  var slidesaves = require('../app/controllers/slidesaves');
  app.get('/api/slidesaves', apiAuthenticated, slidesaves.all);
  app.get('/api/slidesaves/:slide', apiAuthenticated, slidesaves.get);
  app.post('/api/slidesaves', apiAuthenticated, slidesaves.create);
  app.delete('/api/slidesaves/:slide', apiAuthenticated, slidesaves.delete);
  app.post('/api/events/:eventId/base_slide', apiAuthenticated, slidesaves.baseSlide);

  var eventsWorkspaces = require('../app/controllers/eventsWorkspaces');
  app.get('/api/events/:eventId/workspaces', apiAuthenticated, authorized('trainer'), eventsWorkspaces.getForEvent);

  var users = require('../app/controllers/users');
  app.get('/api/users/:id', apiAuthenticated, users.get);
  app.put('/api/users', apiAuthenticated, users.edit);
  app.get('/api/users', apiAuthenticated, users.current);
  app.get('/api/session', apiAuthenticated, users.session);

  // We should change this to ordinary /api calls
  var req = require('../app/controllers/require');
  app.get('/api/require/decks/:id/slides', apiAuthenticated, req.getDeckSlides);
  app.get('/api/require/decks/:id', apiAuthenticated, req.getDeck);
  app.get('/api/require/slides/:id', apiAuthenticated, req.getSlide);

  var plugins = require('./plugins');
  var router = require('express').Router();
  /*
   *  TODO [ToDr] Because plugins are loaded asynchronously we expose router2
   *   to allow plugins to intercept calls that normally would be handled by /*
   */
  var router2 = require('express').Router();
  plugins.invokePlugins('initApi', [router, authenticated, app, router2, logger]);
  app.use('/api/', router);
  app.use('/', router2);

  // login
  var login = require('../app/controllers/login');
  app.get('/login', function (req, res, next) {
    if (req.user) {
      res.redirect('/');
      return;
    }
    next();
  }, login.login);
  app.get('/logout', login.logout);

  // auth
  var redirections = {
    successRedirect: '/redirect',
    failureRedirect: '/login',
    failureFlash: true
  };

  app.post('/auth/login', passport.authenticate('local', redirections));
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['email']
  }));
  app.get('/auth/google/callback', passport.authenticate('google', redirections));
  app.get('/auth/github', passport.authenticate('github'));
  app.get('/auth/github/callback', passport.authenticate('github', redirections));
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', redirections));

  // registration
  var registration = require('../app/controllers/registration');
  app.get('/registration', registration.form);
  app.post('/registration', function (req, res, next) {
    registration.register(req, res, next, app);
  });

  // home route
  var slider = require('../app/controllers/slider');
  app.get('/decks/:slides/trainer', authenticated, authorized('trainer'), slider.trainer);
  app.get('/decks/:slides*', authenticateAsAnon, authenticated, authorizedForEditMode('admin:slides'), slider.deck);
  app.get('/slides/:slide', authenticateAsAnon, authenticated, authorizedForEditMode('admin:slides'), slider.slide);

  // Dashboard
  var dashboard = require('../app/controllers/dashboard');
  app.get('/dashboard/*', authenticated, dashboard.index);

  // Courses
  var courses = require('../app/controllers/courses');
  app.get('/courses2/*', authenticated, courses.index);

  // xplatform
  var devmeetings = require('../app/controllers/devmeetings');
  // app.get('/', authenticated, devmeetings.xplatform);
  app.get('/admin/?*', authenticated, authorized('admin:events'), devmeetings.admin);
  app.get('/*', authenticateAsAnon, nonAnon, redirectIfNeeded, authorizedForEditMode('admin:events'), devmeetings.xplatform);
};
