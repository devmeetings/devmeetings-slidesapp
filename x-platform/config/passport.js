var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var config = require('./config');
var users = require('../app/services/users');
var gravatar = require('gravatar');

function getEmail (profile) {
  return profile.emails ? profile.emails.pop().value : null;
}

function createUser (id, profile, type, done) {
  var email = getEmail(profile) || id + '@xplatform.org';
  // Some github profiles does not have displayName configured
  var name = profile.displayName || id;
  users.findOrCreate({
    userId: type + ':' + id,
    name: name,
    email: email,
    avatar: gravatar.url(email),
    type: type,
    verified: true
  }, done);
}

/** Passport strategies **/
passport.use(new LocalStrategy(users.authFields, users.verify));

passport.use(new GoogleStrategy({
  clientID: config.google.id,
  clientSecret: config.google.secret,
  callbackURL: config.realmUrl + '/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
  createUser(profile.id, profile, 'g+', done);
}));

passport.use(new GithubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.realmUrl + '/auth/github/callback'
}, function (accessToken, refreshToken, profile, done) {
  createUser(profile.id, profile, 'github', done);
}));

// @TODO https://github.com/jaredhanson/passport-facebook#issues
passport.use(new FacebookStrategy({
  clientID: config.fb.id,
  clientSecret: config.fb.secret,
  callbackURL: config.realmUrl + '/auth/facebook/callback'
}, function (accessToken, refreshToken, profile, done) {
  createUser(profile.id, profile, 'fb', done);
}));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  users.findByUserId(id, function (err, user) {
    if (user && !user.avatar) {
      user.avatar = gravatar.url(user.email);
    }
    done(err, user);
  });
});
