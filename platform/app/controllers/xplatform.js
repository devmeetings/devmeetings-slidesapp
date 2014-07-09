var Xplatform = {
    index: function(req, res) {
        res.render('xplatform/xplatform', {
            title: 'Xplatform',
            withInspectlet: req.withInspectlet,
            cacheBustingVersion: req.cacheBustingVersion
        });
    }
};

module.exports = Xplatform;