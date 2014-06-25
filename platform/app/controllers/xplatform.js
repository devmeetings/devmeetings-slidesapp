

var Xplatform = {
    index: function (req, res) {
        res.render('xplatform/xplatform', {
            title: 'Xplatform',
            cacheBustingVersion: req.cacheBustingVersion
        });
    }
};

module.exports = Xplatform;
