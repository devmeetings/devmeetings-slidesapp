
exports.index = function(req, res) {
    res.render('admin/index', {
        title: 'Decks Management'
    });
};

exports.partials = function(req, res) {
    res.render('admin/partials/'+req.params.name);
};
