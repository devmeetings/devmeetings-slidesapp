exports.index = function (req, res) {
  res.render('dm-courses/dm-courses', {
    title: 'Courses',
    editMode: req.query.edit,
    withInspectlet: req.withInspectlet,
    withGoogleAnalytics: req.withGoogleAnalytics,
    cacheBustingVersion: req.cacheBustingVersion,
    jsModulesPath: req.jsModulesPath,
    version: req.version,
    isLoggedIn: req.user !== undefined
  });
};
