var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GithubStrategy = require('passport-github').Strategy,
    config = require('./config'),
    users = require('../app/services/users'),
    gravatar = require('gravatar');

function getEmail(profile) {
    return profile.emails ? profile.emails.pop().value : null;
}

function createUser(id, profile, type, done) {
    var email = getEmail(profile) || id + "@xplatform.org";
    users.findOrCreate({
        userId: id,
        name: profile.displayName,
        email: email,
        avatar: gravatar.url(email),
        type: type,
        verified: true
    }, done);
}

/** Passport strategies **/
passport.use(new LocalStrategy(users.authFields, users.verify));

passport.use(new GoogleStrategy({
    returnURL: config.realmUrl + "/auth/google/return",
    realm: config.realmUrl
}, function(identifier, profile, done) {
    createUser(identifier, profile, 'g+', done);
}));


passport.use(new GithubStrategy({
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: config.realmUrl + "/auth/github/callback"
}, function(accessToken, refreshToken, profile, done) {
    createUser(profile.id, profile, 'github', done);
}));

// @TODO https://github.com/jaredhanson/passport-facebook#issues
passport.use(new FacebookStrategy({
    clientID: config.fb.id,
    clientSecret: config.fb.secret,
    callbackURL: config.realmUrl + "/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {
    createUser(profile.id, profile, 'fb', done);
}));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    users.findByUserId(id, done);
});