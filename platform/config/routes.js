var passport = require('passport');

var authenticated = function loggedIn(req, res, next) {
    if (req.user) {
        if (req.session.redirect_to) {
            var redirect = req.session.redirect_to;
            delete req.session.redirect_to;
            res.redirect(redirect);
            return;
        }
        next();
    } else {
        req.session.redirect_to = req.url;
        res.redirect('/login');
    }
};

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

    var req = require('../app/controllers/require');
    app.get('/require/decks/:id/slides.js', authenticated, req.getDeckSlides);
    app.get('/require/decks/:id.js', authenticated, req.getDeck);
    app.get('/require/plugins/paths.js', authenticated, req.pluginsPaths);
    app.get('/require/slides/:id.js', authenticated, req.getSlide);

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
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', redirections));

    //xplatform
    var xplatform = require('../app/controllers/xplatform');
    app.get('/', authenticated, xplatform.index);

    // registration
    var registration = require('../app/controllers/registration');
    app.get('/registration', registration.form);
    app.post('/registration', function(req, res, next){
        registration.register(req, res, next, app);
    });

    //home route
    var slider = require('../app/controllers/slider');
    app.get('/decks/:slides', authenticated, slider.deck);
    app.get('/decks/:slides/trainer', authenticated, slider.trainer);
    app.get('/slides/:slide', authenticated, slider.slide);

    // Admin panel
//    var admin = require('../app/controllers/admin');
//    app.get('/admin', authenticated, admin.index);
//    app.get('/admin/partials/:name', authenticated, admin.partials);


    var plugins = require('./plugins');
    plugins.invokePlugins('initApi', ['/api/', app, authenticated]);
};
