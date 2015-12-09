var User = require('../models/user');
var gravatar = require('gravatar');
var uuid = require('node-uuid');
var logger = require('../../config/logging');
var UserService = require('../services/users');

function fixAvatar (user) {
  user.avatar = user.avatar || gravatar.url(user.email);
}

var Users = {
  get: function (req, res) {
    var userId = req.params.id;
    User.findOne({
      _id: userId
    }).select('name email avatar bio').exec().then(function (user) {
      fixAvatar(user);
      delete user.email;
      res.send(user);
    });
  },
  edit: function (req, res) {
    var userId = req.user._id.toString();
    delete req.body._id;

    if (req.body.email) {
      req.body.avatar = gravatar.url(req.body.email);
    }

    User.findByIdAndUpdate(userId, req.body, {}, function (err, user) {
      if (err) {
        logger.error(err);
        res.sendStatus(400);
        return;
      }
      res.sendStatus(200);
    });
  },
  session: function (req, res) {
    res.send(req.user.userId);
  },
  current: function (req, res) {
    var userId = req.user._id.toString();
    User.findOne({
      _id: userId
    }, function (err, user) {
      if (err) {
        logger.error(err);
        res.sendStatus(400);
        return;
      }
      fixAvatar(user);
      res.send(user);
    });
  },
  resetPasswordView: function (req, res) {
    res.render('login/reset', {
      id: req.params.id,
      title: 'Password Recovery',
      isDev: req.isDev,
      editMode: req.query.edit,
      withInspectlet: req.withInspectlet,
      withGoogleAnalytics: req.withGoogleAnalytics,
      cacheBustingVersion: req.cacheBustingVersion,
      jsModulesPath: req.jsModulesPath,
      version: req.version,
      isLoggedIn: req.user !== undefined
    });
  },
  resetPassword: function (req, res) {
    var code = req.body.code;
    var password = req.body.password;
    var password2 = req.body.password2;
    var userId = req.params.id;

    if (password !== password2) {
      return res.status(400).send('Passwords doesnt match');
    }

    User.findOne({
      _id: userId
    }).exec(function (err, user) {
      if (err) {
        return res.status(500).send(err);
      }

      if (!user) {
        return res.sendStatus(404);
      }

      if (user.passwordChangeCode !== code || !user.passwordChangeCode) {
        return res.status(400).send('Code is invalid!');
      }

      UserService.setNewPassword(userId, password, function () {
        res.send('OK');
      });
    });
  },
  resetPasswordRequest: function (req, res) {
    var code = uuid.v4();
    var userId = req.params.id;

    User.update({
      _id: userId
    }, {
      $set: {
        passwordChangeCode: code
      }
    }).exec(function () {
      res.send(code);
    });
  }
};

module.exports = Users;
