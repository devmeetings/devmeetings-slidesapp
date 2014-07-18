var Devmeetings = {
    xplatform: function(req, res) {
        res.render('dm-xplatform/dm-xplatform', {
            title: 'Xplatform',
            withInspectlet: req.withInspectlet,
            withGoogleAnalytics: req.withGoogleAnalytics,
            cacheBustingVersion: req.cacheBustingVersion
        });
    },
    admin: function(req, res) {
        res.render('dm-admin/dm-admin', {
            title: 'Admin',
            withInspectlet: req.withInspectlet,
            withGoogleAnalytics: req.withGoogleAnalytics,
            cacheBustingVersion: req.cacheBustingVersion
        });
    }
};

module.exports = Devmeetings;
