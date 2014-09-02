var passport = require('passport');

var shouldBeAuthenticated = function loggedIn(shouldRedirect, req, res, next) {
    if (req.user) {
        if (req.session.redirect_to) {
            var redirect = req.session.redirect_to;
            delete req.session.redirect_to;
            res.redirect(redirect);
            return;
        }
        next();
    } else if (shouldRedirect) {
        req.session.redirect_to = req.url;
        res.redirect('/login');
    } else {
        res.send(401);
    }
};

apiAuthenticated = shouldBeAuthenticated.bind(null, false);
authenticated = shouldBeAuthenticated.bind(null, true);

module.exports = function(app) {
    var slides = require('../app/controllers/slides');
    app.get('/api/slides', authenticated, slides.list);
    app.post('/api/slides', authenticated, slides.create);
    app.get('/api/slides/:id', authenticated, slides.get);

    var decks = require('../app/controllers/decks');
    app.get('/api/decks', authenticated, decks.list);
    app.post('/api/decks', authenticated, decks.create);
    app.delete('/api/decks/:id', authenticated, decks.delete);
    app.put('/api/decks/:id', authenticated, decks.edit);

    var recordings = require('../app/controllers/recordings');
    app.get('/api/recordings', authenticated, recordings.list);
    app.get('/api/recordings/:id', authenticated, recordings.get);
    app.post('/api/recordings/:id/split/:time', authenticated, recordings.split);
    app.post('/api/recordings/:id/cutout/:from/:to', authenticated, recordings.cutout);

    var events = require('../app/controllers/events');
    app.get('/api/events/:type', events.list);
    app.get('/api/event/:id', authenticated, events.get);
    app.post('/api/event/done/:id', authenticated, events.done);
    app.post('/api/event/start/:id', authenticated, events.start);
    app.post('/api/event/task_done/:event/:task', authenticated, events.taskDone);
    app.get('/api/event/first_task/:id', authenticated, events.firstTask);
    app.get('/api/eventWithTask/:event/:task', authenticated, events.eventWithTask);

    var player = require('../app/controllers/player');
    app.get('/api/player/:id/:training', authenticated, player.userSaves);
    app.post('/api/player', authenticated, player.save);

    var trainings = require('../app/controllers/trainings');
    app.get('/api/trainings', authenticated, trainings.list);
    app.post('/api/trainings', authenticated, trainings.create);
    app.get('/api/trainings/:id', authenticated, trainings.get);
    app.put('/api/trainings/:id', authenticated, trainings.edit);
    app.delete('/api/trainings/:id', authenticated, trainings.delete);

    var users = require('../app/controllers/users');
    app.get('/api/users/:id', apiAuthenticated, users.get);
    app.put('/api/users', apiAuthenticated, users.edit);
    app.get('/api/users', apiAuthenticated, users.current);

    var observes = require('../app/controllers/observes');
    app.get('/api/observes', authenticated, observes.get);
    app.post('/api/observes', authenticated, observes.observe);
    app.delete('/api/observes/:id', authenticated, observes.unobserve);

    var streams = require('../app/controllers/streams');
    app.get('/api/streams', streams.all);
    app.get('/api/streams/:id', apiAuthenticated, streams.get);

    var payments = require('../app/controllers/payments');
    app.post('/api/payments/:course/:price/:subscription', authenticated, payments.pay);

    var snapshots = require('../app/controllers/snapshots');
    app.get('/api/snapshots/:startTime?', authenticated, snapshots.list);
    app.post('/api/snapshots/:startTime?', authenticated, snapshots.import);

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
        successRedirect: '/',
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
    app.get('/', devmeetings.xplatform);

    // registration
    var registration = require('../app/controllers/registration');
    app.get('/registration', registration.form);
    app.post('/registration', function(req, res, next) {
        registration.register(req, res, next, app);
    });

    //home route
    var slider = require('../app/controllers/slider');
    app.get('/decks/:slides', authenticated, slider.deck);
    app.get('/decks/:slides/trainer', authenticated, slider.trainer);
    app.get('/slides/:slide', authenticated, slider.slide);

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
