var User = require('../models/user');
var gravatar = require('gravatar');
var mongoose = require('mongoose');

/**
 * Registration form view
 * @param {Object} req
 * @param {Object} res
 */
exports.form = function (req, res) {
  res.render('registration/form', {
    cacheBustingVersion: req.cacheBustingVersion,
    title: 'Create account'
  });
};

/**
 * Register user action
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @param {Object} app
 */
exports.register = function (req, res, next, app) {
  var userData = {
    email: req.body.email || null,
    name: req.body.username || null,
    password: req.body.password || null,
    avatar: gravatar.url(req.body.email),
    userId: new mongoose.Types.ObjectId()
  };

  User.findOne({
    email: userData.email
  }).count(function (err, count) {
    if (err) {
      throw err;
    }
    if (count > 0) {
      res.render('registration/form', {
        cacheBustingVersion: req.cacheBustingVersion,
        message: 'User already exist'
      });
      return;
    }

    var newUser = new User(userData);
    newUser.save(function (err) {
      if (err) {
        throw err;
      }
      req._passport.instance.serializeUser(newUser, (function (req) {
        return function (err, user) {
          if (err) {
            res.render('registration/form', {
              message: 'Error occurred serializing user'
            });
            return;
          }

          // @TODO send mail with activation link
          /*
          mailer.sendEmail(app, 'email/registration',
              {
                  to: userData.email,
                  subject: 'Welcome to Xplatform',
                  userName: userData.name
              },
              function(err) {
                  if (err) {
                      // @TODO user was added but mail was not send - handle it
                      res.render('registration/form', {
                          message: err.message
                      });
                      return;
                  }
              }
          );*/
          req._passport.session.user = user;
          res.redirect('/');
        };
      })(req));
    });
  });
};
