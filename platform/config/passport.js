var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    users = require('../users.json'),
    config = require('./config');

var msg = function(message) {
    return {
        message: message
    };
};

passport.use(new LocalStrategy(function(username, password, done) {
    var user = users[username];
    if (!user) {
        done(null, false, msg("Cannot find user " + username));
        return;
    }
    if (user.password !== password) {
        done(null, false, msg("Incorrect password."));
        return;
    }

    done(null, user);
}));

passport.use(new GoogleStrategy({
    returnURL: config.realmUrl + "/auth/google/return",
    realm: config.realmUrl
}, function(identifier, profile, done) {
    done(null, {
        name: profile.displayName
    });
}));

passport.use(new FacebookStrategy({
    // We can only use facebook on production
    clientID: config.fb.id,
    clientSecret: config.fb.secret,
    callbackURL: config.realmUrl + "/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {
    done(null, {
        name: profile.name
    });
}));


passport.serializeUser(function(user, done) {
    done(null, user.name);
});

passport.deserializeUser(function(username, done) {
    // TODO - awful, create users in DB instead of this shit
    if (users[username]) {
        done(null, users[username]);
    } else {
        done(null, {
            name: username
        });
    }
});