var SlideModel = require('../models/slide');
var Q = require('q');

exports.createSlides = function(req, res) {
    var onFinish = function (code, result){
        res.send(code, result);
    };
     
    var slidePromises = req.body.map(function(slide) {
        console.log(slide);
        var promise = Q.ninvoke(SlideModel, 'create', { content: slide } );
        return promise;
    });
    Q.all(slidePromises).then(function(slides){
        onFinish(200, slides.map(function(slide) {
            return slide._id;
        }));
    }, function(err){
        console.log(err);
        onFinish(404, err);    
    });
};

exports.get = function(req, res) {
    SlideModel.findById(req.params.id, function(err, slide) {
        if (err){
            console.log(err);
            res.send(404, err);
            return;
        }
        res.send(slide);
    });
};

