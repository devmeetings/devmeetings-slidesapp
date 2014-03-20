exports.index = function(req, res) {
    res.render('slider/deck', {
        title: 'Devmeetings.pl'
    });
};

exports.slide = function(req, res) {
    res.render('slider/slide', {
        title: 'Slide',
        slide: req.params.slide
    });
};