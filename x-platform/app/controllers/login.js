exports.login = function (req, res) {
  res.render('login/login', {
    error: req.flash('error')[0],
    withInspectlet: req.withInspectlet,
    withGoogleAnalytics: req.withGoogleAnalytics,
    cacheBustingVersion: req.cacheBustingVersion,
    title: 'Log in to Slider'
  });
};

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};
