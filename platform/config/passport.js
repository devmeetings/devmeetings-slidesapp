var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config'),
    users = require('../app/services/users'),
    gravatar = require('gravatar');

/** Passport strategies **/

passport.use(new LocalStrategy(users.authFields, users.verify));

passport.use(new GoogleStrategy({
    returnURL: config.realmUrl + "/auth/google/return",
    realm: config.realmUrl
}, function(identifier, profile, done) {
    var email = profile.emails ? profile.emails.pop().value : null;
    users.findOrCreate({
        userId: identifier,
        name: profile.displayName,
        email: email,
        avatar: gravatar.url(email),
        type: 'g+',
        verified: true
    }, done);
}));

// @TODO https://github.com/jaredhanson/passport-facebook#issues
passport.use(new FacebookStrategy({
    clientID: config.fb.id,
    clientSecret: config.fb.secret,
    callbackURL: config.realmUrl + "/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {
    var email = profile.emails ? profile.emails.pop().value : null;
    users.findOrCreate({
        userId: profile.id,
        name: profile.displayName,
        email: email,
        avatar: gravatar.url(email),
        type: 'fb',
        verified: true
    }, done);
}));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    users.findByUserId(id, done);
});
