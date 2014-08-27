var Devmeetings = {
    xplatform: function(req, res) {
        res.render('dm-xplatform/dm-xplatform', {
            title: 'Xplatform',
            withInspectlet: req.withInspectlet,
            withGoogleAnalytics: req.withGoogleAnalytics,
            cacheBustingVersion: req.cacheBustingVersion,
            jsModulesPath: req.jsModulesPath,
            isLoggedIn: req.user !== undefined
        });
    },
    admin: function(req, res) {
        res.render('dm-admin/dm-admin', {
            title: 'Admin',
            withInspectlet: req.withInspectlet,
            withGoogleAnalytics: req.withGoogleAnalytics,
            cacheBustingVersion: req.cacheBustingVersion,
            jsModulesPath: req.jsModulesPath
        });
    }
};

module.exports = Devmeetings;
