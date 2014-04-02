var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    users = require('../users.json');

var msg = function(message) {
    return {
        message: message
    };
};

passport.use(new LocalStrategy(function(username, password, done){
    var user = users[username];
    if (!user) {
        done(null, false, msg("Cannot find user "+username));
        return;
    }
    if (user.password !== password) {
        done(null, false, msg("Incorrect password."));
        return;
    }

    done(null, user);
}));


passport.serializeUser(function(user, done) {
    done(null, user.name);
});

passport.deserializeUser(function(username, done) {
    done(null, users[username])
});