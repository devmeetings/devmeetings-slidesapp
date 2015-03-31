var passport = require('passport');

var shouldBeAuthenticated = function loggedIn(shouldRedirect, req, res, next) {
    if (req.user) {
        redirectIfNeeded(req, res, next);
    } else if (shouldRedirect) {
        req.session.redirect_to = req.url;
        res.redirect('/login');
    } else {
        res.sendStatus(401);
    }
};

var authorized = function(role) {
    return function(req, res, next) {
        if (req.user && req.user.acl.indexOf(role) !== -1) {
            next();
        } else {
            res.sendStatus(403);
        }
    };
};
var authorizedForEditMode = function(role) {
    var auth = authorized(role);
    return function(req, res, next) {
        if (req.query.edit) {
            auth(req, res, next);
        } else {
            next();
        }
    };
};

var redirectIfNeeded = function(req, res, next) {
    if (req.session.redirect_to) {
        var redirect = req.session.redirect_to;
        delete req.session.redirect_to;
        res.redirect(redirect);
        return;
    }
    next();
};

var authenticateAsAnon = function(req, res, next) {
    if (req.query.anon) {
        var users = require('../app/services/users');
        users.findLocalUserByEmail('anon@todr.me', function(err, user) {
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
var nonAnon = function(req, res, next) {
    if (req.user && req.user.email === 'anon@todr.me' && !req.query.anon) {
        req.logout();
    }
    next();
};

var apiAuthenticated = shouldBeAuthenticated.bind(null, false);
var authenticated = shouldBeAuthenticated.bind(null, true);

module.exports = function(app) {
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
    app.post('/api/recordings/:id/split/:time', apiAuthenticated, authorized('admin:super'), recordings.split);
    app.post('/api/recordings/:id/cutout/:from/:to', apiAuthenticated, authorized('admin:super'), recordings.cutout);

    var events = require('../app/controllers/events');
    app.get('/api/events', events.all);
    app.get('/api/users/:userId/events', apiAuthenticated, events.userEvents);
    app.get('/api/events/:id', apiAuthenticated, events.get);
    app.get('/api/events/:id/annotations', apiAuthenticated, events.getAllAnnotations);
    app.get('/api/events/:id/annotations/:annotationId', apiAuthenticated, events.getAnnotations);
    app.post('/api/event_visibility/:event/:visible', apiAuthenticated, authorized('admin:events'), events.changeVisibility);

    app.post('/api/event_iteration_material_anno/:event/:iteration/:material', apiAuthenticated, authorized('admin:events'), events.annotationCreate);
    app.put('/api/event_iteration_material_anno/:event/:iteration/:material/:id', apiAuthenticated, authorized('admin:events'), events.annotationEdit);

    var fetchEvent = require('../app/controllers/fetchEvent');
    app.post('/api/events', apiAuthenticated, authorized('admin:events'), fetchEvent.createEventFromZip);

    var slidesaves = require('../app/controllers/slidesaves');
    app.get('/api/slidesaves', apiAuthenticated, slidesaves.all);
    app.get('/api/slidesaves/:slide', apiAuthenticated, slidesaves.get);
    app.post('/api/slidesaves', apiAuthenticated, slidesaves.create);
    app.delete('/api/slidesaves/:slide', apiAuthenticated, slidesaves.delete);
    app.post('/api/events/:eventId/base_slide', apiAuthenticated, slidesaves.baseSlide);

    var eventsWorkspaces = require('../app/controllers/eventsWorkspaces');
    app.get('/api/events/:eventId/workspaces', apiAuthenticated, authorized('trainer'), eventsWorkspaces.getForEvent);
    app.get('/api/workspaces/users/:userId', apiAuthenticated, authorized('trainer'), eventsWorkspaces.getPages);
    app.post('/api/workspaces/users/:userId/recording', apiAuthenticated, authorized('admin:events'), eventsWorkspaces.convertToRecording);

    var users = require('../app/controllers/users');
    app.get('/api/users/:id', apiAuthenticated, users.get);
    app.put('/api/users', apiAuthenticated, users.edit);
    app.get('/api/users', apiAuthenticated, users.current);
    app.get('/api/session', apiAuthenticated, users.session);

    var snapshots = require('../app/controllers/snapshots');
    app.get('/api/snapshots/:startTime?', apiAuthenticated, authorized('admin:events'), snapshots.list);
    app.post('/api/snapshots/:startTime?', apiAuthenticated, authorized('admin:events'), snapshots.import);
    app.put('/api/snapshots/:startTime?', apiAuthenticated, authorized('admin:events'), snapshots.convert);

    app.get('/api/rawRecordings', apiAuthenticated, authorized('admin:events'), snapshots.getRawRecordingsGroups);
    app.get('/api/rawRecordings/:group', apiAuthenticated, authorized('admin:events'), snapshots.getRawRecordings);

    // We should change this to ordinary /api calls (except for plugins)
    var req = require('../app/controllers/require');
    app.get('/require/decks/:id/slides.js', apiAuthenticated, req.getDeckSlides);
    app.get('/require/decks/:id.js', apiAuthenticated, req.getDeck);
    app.get('/require/plugins/paths.js', req.pluginsPaths);
    app.get('/require/slides/:id.js', apiAuthenticated, req.getSlide);

    //login
    var login = require('../app/controllers/login');
    app.get('/login', function(req, res, next) {
        if (req.user) {
            res.redirect('/');
            return;
        }
        next();
    }, login.login);
    app.get('/logout', login.logout);

    //auth
    var redirections = {
        successRedirect: '/#/redirect',
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

    //xplatform
    var devmeetings = require('../app/controllers/devmeetings');
    //app.get('/', authenticated, devmeetings.xplatform);
    app.get('/admin', authenticated, authorized('admin:events'), devmeetings.admin);
    app.get('/', authenticateAsAnon, nonAnon, redirectIfNeeded, authorizedForEditMode('admin:events'), devmeetings.xplatform);

    // registration
    var registration = require('../app/controllers/registration');
    app.get('/registration', registration.form);
    app.post('/registration', function(req, res, next) {
        registration.register(req, res, next, app);
    });

    //home route
    var slider = require('../app/controllers/slider');
    app.get('/decks/:slides', authenticateAsAnon, authenticated, authorizedForEditMode('admin:slides'), slider.deck);
    app.get('/decks/:slides/trainer', authenticated, authorized('trainer'), slider.trainer);
    app.get('/slides/:slide', authenticateAsAnon, authenticated, authorizedForEditMode('admin:slides'), slider.slide);

    // Courses
    var courses = require('../app/controllers/courses');
    app.get('/courses', authenticated, courses.index);

    // This probably should be api calls?
    var editor = require('../app/controllers/editor');
    app.get('/editor/soundslist', authenticated, authorized('admin:events'), editor.soundsList);
    app.get('/editor/reclist', authenticated, authorized('admin:events'), editor.recList);



    var plugins = require('./plugins');
    var router = require('express').Router();
    plugins.invokePlugins('initApi', [router, authenticated, app]);
    app.use('/api/', router);
};
