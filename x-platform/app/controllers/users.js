var User = require('../models/user');
var gravatar = require('gravatar');
var logger = require('../../config/logging');

function fixAvatar(user) {
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

        User.findByIdAndUpdate(userId, req.body, {}, function (err, user) {
            if (err) {
                logger.error(err);
                res.sendStatus(400);
                return;
            }
            res.sendStatus(200);
        });
    },
    session: function(req, res) {
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
    
    }
};


module.exports = Users;
