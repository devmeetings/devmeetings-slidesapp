

exports.login = function(req, res) {
    res.render('login/login', {
        title: 'Log in to Slider'
    });
};

exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
};