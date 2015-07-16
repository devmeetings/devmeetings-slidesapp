var Devmeetings = {
  xplatform: function (req, res) {
    res.render('dm-xplatform/dm-xplatform', {
      title: 'XPlatform',
      isDev: req.isDev,
      editMode: req.query.edit,
      withInspectlet: req.withInspectlet,
      withGoogleAnalytics: req.withGoogleAnalytics,
      cacheBustingVersion: req.cacheBustingVersion,
      jsModulesPath: req.jsModulesPath,
      version: req.version,
      isLoggedIn: req.user !== undefined
    });
  },
  admin: function (req, res) {
    res.render('dm-admin/dm-admin', {
      title: 'Admin',
      isDev: req.isDev,
      withInspectlet: req.withInspectlet,
      withGoogleAnalytics: req.withGoogleAnalytics,
      cacheBustingVersion: req.cacheBustingVersion,
      jsModulesPath: req.jsModulesPath,
      version: req.version
    });
  }
};

module.exports = Devmeetings;
