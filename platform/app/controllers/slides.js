var SlideModel = require('../models/slide');
var Q = require('q');

exports.createOrUpdate = function(req, res) {
    var onFinish = function (code, result){
        res.send(code, result);
    };
     
    var slidePromises = req.params.map(function(slide) {
        var promise = Q.ninvoke(DeckModel, 'findByIdAndUpdate', slide._id, slide, { upsert: true });
        return promise;
    });
    Q.all(slidePromises).then(function(slides){
        onFinish(200, slides.map(function(slide) {
            return {
                id: slide.id,
                title: slide.title
            };
        }));
    }, function(err){
        onFinish(404, err);    
    });
};

