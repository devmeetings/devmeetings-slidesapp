var Payment = require('../models/payment'),
    User = require('../models/user'),
    Q = require('q');

var Payments = {
    pay: function (req, res) {
        var userId = req.user._id;

        Q.ninvoke(User, 'findById', userId).then(function (user) {
            return Q.ninvoke(Payment, 'create', {
                user: {
                    name: user.name,
                    email: user.email,
                    userId: user._id
                },
                course: req.params.course,
                price: parseInt(req.params.price),
                subscription: req.params.subscription === 'true' ? true : false
            });
        }).then(function (payment) {
            res.send(200);
        }).fail(function (err) {
            console.error(err);
            res.send(400);
        });
    }
};

module.exports = Payments;
