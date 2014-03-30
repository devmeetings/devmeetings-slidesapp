exports.index = function(req, res) {
    res.render('slider/deck', {
        title: 'Devmeetings.pl',
        slides: req.params.slides
    });
};

exports.edit = function(req, res) {
    res.render('slider/deck-edit', {
        title: 'Slides Editor',
        slides: req.params.slides
    });
};
exports.slide = function(req, res) {
    res.render('slider/slide', {
        title: 'Slide',
        slides: req.params.slides,
        slide: req.params.slide
    });
};
exports.slideEdit = function(req, res) {
    res.render('slider/slide', {
        title: 'Slide',
        slides: req.params.slides,
        slide: req.params.slide
    });
};

exports.trainer = function(req, res) {
    res.render('slider/trainer', {
        title: "Trainer's Screen",
        slides: req.params.slides
    });
};