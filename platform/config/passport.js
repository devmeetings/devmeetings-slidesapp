var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    usersFromJson = require('../users.json'),
    config = require('./config'),
    users = require('../app/services/users'),
    _ = require('lodash');

var msg = function(message) {
    return {
        message: message
    };
};

passport.use(new LocalStrategy(function(username, password, done) {
    var user = _.find(usersFromJson, function(user) {
        return user.login === username;
    });

    if (!user) {
        done(null, false, msg("Cannot find user " + username));
        return;
    }
    if (user.password !== password) {
        done(null, false, msg("Incorrect password."));
        return;
    }

    users.getOrCreateUser(user, done);
}));

passport.use(new GoogleStrategy({
    returnURL: config.realmUrl + "/auth/google/return",
    realm: config.realmUrl
}, function(identifier, profile, done) {

    var user = {
        userId: identifier,
        name: profile.displayName
    };

    users.getOrCreateUser(user, done);
}));

passport.use(new FacebookStrategy({
    // We can only use facebook on production
    clientID: config.fb.id,
    clientSecret: config.fb.secret,
    callbackURL: config.realmUrl + "/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {

    var user = {
        userId: profile.id,
        name: profile.name
    };

    users.getOrCreateUser(user, done);
}));


passport.serializeUser(function(user, done) {
    done(null, user.userId);
});

passport.deserializeUser(function(userId, done) {
    users.findByUserId(userId, done);
});