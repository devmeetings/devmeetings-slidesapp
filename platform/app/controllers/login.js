exports.login = function(req, res) {
    res.render('login/login', {
        cacheBustingVersion: req.cacheBustingVersion,
        title: 'Log in to Slider'
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};