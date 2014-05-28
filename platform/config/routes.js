var passport = require('passport');

var ctrl = function(ctrlName) {
    return require('../app/controllers/' + ctrlName);
};


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
    var slides = ctrl('slides');
    app.post('/api/slides/list', authenticated, slides.createSlides);
    app.get('/api/slides/:id', authenticated, slides.get);

    // API
    var decks = ctrl('decks');
    app.get('/api/decks', authenticated, decks.list);
    app.post('/api/decks', authenticated, decks.create);        
    app.delete('/api/decks/:id', authenticated, decks.delete);  
    app.put('/api/decks/:id', authenticated, decks.edit);       
    
    var req = ctrl('require');
    app.get('/require/decks/:id/slides.js', authenticated, req.getDeckSlides);
    app.get('/require/decks/:id.js', authenticated, req.getDeck);
    app.get('/require/plugins/paths', authenticated, req.pluginsPaths);

    //login
    var login = ctrl('login');
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
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', redirections));


    //home route
    var slider = ctrl('slider');
    app.get('/', authenticated, slider.index);
    app.get('/slides/:slides', authenticated, slider.deck);
    app.get('/slides/:slides/trainer', authenticated, slider.trainer);
    app.get('/slides/:slides/slide-:slide', authenticated, slider.slide);

    // Admin panel
    var admin = ctrl('admin');
    app.get('/admin', authenticated, admin.index);
    app.get('/admin/partials/:name', authenticated, admin.partials);
};
