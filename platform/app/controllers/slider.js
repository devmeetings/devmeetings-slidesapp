exports.index = function(req, res) {
    res.render('slider/deck', {
        title: 'Devmeetings.pl'
    });
};

exports.edit = function(req, res) {
    res.render('slider/deck-edit', {
        title: 'Slides Editor'
    });
};
exports.slide = function(req, res) {
    res.render('slider/slide', {
        title: 'Slide',
        slide: req.params.slide
    });
};
exports.slideEdit = function(req, res) {
    res.render('slider/slide', {
        title: 'Slide',
        slide: req.params.slide
    });
};

exports.trainer = function(req, res) {
    res.render('slider/trainer', {
        title: "Trainer's Screen"
    });
};