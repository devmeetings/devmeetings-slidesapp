
var passport = require('passport');

var ctrl = function(ctrlName) {
    return require('../app/controllers/'+ctrlName);
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

    var codeSnapshots = ctrl('codeSnapshots');
    app.get('/api/codeSnapshots', authenticated, codeSnapshots.list);
    app.post('/api/codeSnapshots', authenticated, codeSnapshots.update);

    //login
    var login = ctrl('login');
    app.get('/login', login.login);
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    //home route
    var slider = ctrl('slider');
    app.get('/', authenticated, slider.index);
    app.get('/slides/:slides', authenticated, slider.deck);
    app.get('/slides/:slides/edit', authenticated, slider.edit);
    app.get('/slides/:slides/trainer', authenticated, slider.trainer);
    app.get('/slides/:slides/slide-:slide', authenticated, slider.slide);
    app.get('/slides/:slides/edit:slide-:slide', authenticated, slider.slide);
    app.get('/slides/:slides/edit/edit:slide-:slide', authenticated, slider.slide);  //mk ugly fix

    // Admin panel
    var admin = ctrl('admin');
    app.get('/admin/', authenticated, admin.index);
    app.get('/admin/partials/:name', authenticated, admin.partials);
};
