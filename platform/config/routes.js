var passport = require('passport');

var ctrl = function(ctrlName) {
    return require('../app/controllers/' + ctrlName);
};


var authenticated = function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = function(app) {

    // API
    var decks = ctrl('decks');
    app.get('/api/decks', authenticated, decks.list);
    app.post('/api/decks', authenticated, decks.create);
    app.delete('/api/decks/:id', authenticated, decks.delete);
    app.put('/api/decks/:id', authenticated, decks.edit);
    // TODO [ToDr] OMG this is so terrible
    app.get('/decks/:id.js', authenticated, decks.getOneRequireJs);


    //login
    var login = ctrl('login');
    app.get('/login', login.login);
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    app.get('/logout', login.logout);

    //home route
    var slider = ctrl('slider');
    app.get('/', authenticated, slider.index);
    app.get('/slides/:slides', authenticated, slider.deck);
    app.get('/slides/:slides/trainer', authenticated, slider.trainer);
    app.get('/slides/:slides/slide-:slide', authenticated, slider.slide);

    // Admin panel
    var admin = ctrl('admin');
    app.get('/admin/', authenticated, admin.index);
    app.get('/admin/partials/:name', authenticated, admin.partials);
};