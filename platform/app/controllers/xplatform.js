

var Xplatform = {
    index: function (req, res) {
        res.render('xplatform/index/index', {
            title: 'Xplatform',
            cacheBustingVersion: req.cacheBustingVersion
        });
    }
};

module.exports = Xplatform;
