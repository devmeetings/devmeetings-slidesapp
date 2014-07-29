var User = require('../models/user');

var Users = {
    get: function (req, res) {
        var userId = req.params.id;
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
