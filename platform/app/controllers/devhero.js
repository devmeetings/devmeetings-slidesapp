
var Devhero = {
    index: function (req, res) {
        res.render('devhero/index/index', {
            title: 'Devhero',
            cacheBustingVersion: req.cacheBustingVersion
        });
    }
};

module.exports = Devhero;

