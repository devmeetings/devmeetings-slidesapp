var User = require('../models/user');

var Users = {
    get: function (req, res) {
        var userId = req.params.id;
        User.findOne({
            _id: userId
        }).select('name avatar bio').exec().then(function (user) { 
            res.send(user);
        });
    }, 
    edit: function (req, res) {
        var userId = req.user._id.toString();
        delete req.body._id;

        User.findByIdAndUpdate(userId, req.body, {}, function (err, user) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(200);
        });
    },
    session: function(req, res) {
      res.send(req.sessionID);
    },
    current: function (req, res) {
        var userId = req.user._id.toString();
        User.findOne({
            _id: userId
        }, function (err, user) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(user);
        });
    
    }
};


module.exports = Users;
