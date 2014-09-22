var passport = require('passport');

var shouldBeAuthenticated = function loggedIn(shouldRedirect, req, res, next) {
    if (req.user) {
        redirectIfNeeded(req, res, next);
    } else if (shouldRedirect) {
        req.session.redirect_to = req.url;
        res.redirect('/login');
    } else {
        res.send(401);
    }
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

var apiAuthenticated = shouldBeAuthenticated.bind(null, false);
var authenticated = shouldBeAuthenticated.bind(null, true);

module.exports = function(app) {
    var slides = require('../app/controllers/slides');
    app.get('/api/slides', apiAuthenticated, slides.list);
    app.post('/api/slides', apiAuthenticated, slides.create);
    app.get('/api/slides/:id', apiAuthenticated, slides.get);

    var decks = require('../app/controllers/decks');
    app.get('/api/decks', apiAuthenticated, decks.list);
    app.post('/api/decks', apiAuthenticated, decks.create);
    app.delete('/api/decks/:id', apiAuthenticated, decks.delete);
    app.put('/api/decks/:id', apiAuthenticated, decks.edit);

    var recordings = require('../app/controllers/recordings');
    app.get('/api/recordings', apiAuthenticated, recordings.list);
    app.get('/api/recordings/:id', apiAuthenticated, recordings.get);
    app.post('/api/recordings/:id/split/:time', apiAuthenticated, recordings.split);
    app.post('/api/recordings/:id/cutout/:from/:to', apiAuthenticated, recordings.cutout);

    var events = require('../app/controllers/events');
    app.get('/api/events', events.all);
    app.post('/api/events', apiAuthenticated, events.create);
    app.get('/api/events/:id', apiAuthenticated, events.get);
    app.delete('/api/events/:event', apiAuthenticated, events.delete);
    app.post('/api/event_task_done/:event/:task/:done', apiAuthenticated, events.eventTaskDone);
    app.post('/api/event_visibility/:event/:visible', apiAuthenticated, events.changeVisibility);
    app.post('/api/event_iteration/:event', apiAuthenticated, events.eventIterationCreate);
    app.delete('/api/event_iteration/:event/:iteration', apiAuthenticated, events.eventIterationDelete);
    app.post('/api/event_iteration_material/:event/:iteration', apiAuthenticated, events.eventMaterialCreate);
    app.delete('/api/event_iteration_material/:event/:iteration/:material', apiAuthenticated, events.eventMaterialDelete);

    //app.post('/api/add_event_snippet/:event', apiAuthenticated, events.addEventSnippet);
    //app.put('/api/edit_event_snippet/:event/:snippet', apiAuthenticated, events.editEventSnippet);
    //app.delete('/api/delete_event_snippet/:event/:snippet', apiAuthenticated, events.deleteEventSnippet);

    //app.post('/api/add_event_task/:event', apiAuthenticated, events.addEventTask);
    //app.put('/api/edit_event_task/:event/:task', apiAuthenticated, events.editEventTask);
    //app.delete('/api/delete_event_task/:event/:task', apiAuthenticated, events.deleteEventTask);


    
    var slidesaves = require('../app/controllers/slidesaves');
    app.get('/api/slidesaves', apiAuthenticated, slidesaves.all);
    app.get('/api/slidesaves/:slide', apiAuthenticated, slidesaves.get);
    app.post('/api/slidesaves', apiAuthenticated, slidesaves.create);
    app.post('/api/slidesave_from_slide/:slide', apiAuthenticated, slidesaves.slidesaveFromSlide);
    app.put('/api/slidesaves/:slide', apiAuthenticated, slidesaves.edit);
    app.delete('/api/slidesaves/:slide', apiAuthenticated, slidesaves.delete);

    app.post('/api/base_slide/:slide', apiAuthenticated, slidesaves.baseSlide);

    var trainings = require('../app/controllers/trainings');
    app.get('/api/trainings', apiAuthenticated, trainings.list);
    app.post('/api/trainings', apiAuthenticated, trainings.create);
    app.get('/api/trainings/:id', apiAuthenticated, trainings.get);
    app.put('/api/trainings/:id', apiAuthenticated, trainings.edit);
    app.delete('/api/trainings/:id', apiAuthenticated, trainings.delete);

    var uploadTraining = require('../app/controllers/uploadTraining');
    app.post('/uploadTraining', authenticated, uploadTraining.upload);

    var users = require('../app/controllers/users');
    app.get('/api/users/:id', apiAuthenticated, users.get);
    app.put('/api/users', apiAuthenticated, users.edit);
    app.get('/api/users', apiAuthenticated, users.current);

    var observes = require('../app/controllers/observes');
    app.get('/api/observes', apiAuthenticated, observes.get);
    app.post('/api/observes', apiAuthenticated, observes.observe);
    app.delete('/api/observes/:id', apiAuthenticated, observes.unobserve);

    var streams = require('../app/controllers/streams');
    app.get('/api/streams', streams.all);
    app.get('/api/streams/:id', apiAuthenticated, streams.get);

    var snapshots = require('../app/controllers/snapshots');
    app.get('/api/snapshots/:startTime?', apiAuthenticated, snapshots.list);
    app.post('/api/snapshots/:startTime?', apiAuthenticated, snapshots.import);
    app.put('/api/snapshots/:startTime?', apiAuthenticated, snapshots.convert);

    app.get('/api/rawRecordings', apiAuthenticated, snapshots.getRawRecordingsGroups);
    app.get('/api/rawRecordings/:group', apiAuthenticated, snapshots.getRawRecordings);

    var req = require('../app/controllers/require');
    app.get('/require/decks/:id/slides.js', apiAuthenticated, req.getDeckSlides);
    app.get('/require/decks/:id.js', apiAuthenticated, req.getDeck);
    app.get('/require/plugins/paths.js', req.pluginsPaths);
    app.get('/require/slides/:id.js', apiAuthenticated, req.getSlide);

    //login
    var login = require('../app/controllers/login');
    app.get('/login', login.login);
    app.get('/logout', login.logout);

    //auth
    var redirections = {
        successRedirect: '/#/redirect',
        failureRedirect: '/login'
    };

    app.post('/auth/login', passport.authenticate('local', redirections));
    app.get('/auth/google', passport.authenticate('google'));
    app.get('/auth/google/return', passport.authenticate('google', redirections));
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', redirections));
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', redirections));

    //xplatform
    var devmeetings = require('../app/controllers/devmeetings');
    //app.get('/', authenticated, devmeetings.xplatform);
    app.get('/admin', authenticated, devmeetings.admin);
    app.get('/', redirectIfNeeded, devmeetings.xplatform);

    // registration
    var registration = require('../app/controllers/registration');
    app.get('/registration', registration.form);
    app.post('/registration', function(req, res, next) {
        registration.register(req, res, next, app);
    });

    //home route
    var slider = require('../app/controllers/slider');
    app.get('/decks/:slides', authenticateAsAnon, authenticated, slider.deck);
    app.get('/decks/:slides/trainer', authenticated, slider.trainer);
    app.get('/slides/:slide', authenticateAsAnon, authenticated, slider.slide);

    // Admin panel
    var admin = require('../app/controllers/admin');
    app.get('/admin_old', authenticated, admin.index);
    app.get('/admin_old/partials/:name', authenticated, admin.partials);

    var editor = require('../app/controllers/editor');
    app.get('/editor/soundslist', authenticated, editor.soundsList);
    app.get('/editor/reclist', authenticated, editor.recList);



    var plugins = require('./plugins');
    plugins.invokePlugins('initApi', ['/api/', app, authenticated]);
};
