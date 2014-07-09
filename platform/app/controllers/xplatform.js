var Xplatform = {
    index: function(req, res) {
        res.render('xplatform/xplatform', {
            title: 'Xplatform',
            withInspectlet: req.withInspectlet,
            withGoogleAnalytics: req.withGoogleAnalytics,
            cacheBustingVersion: req.cacheBustingVersion
        });
    }
};

module.exports = Xplatform;