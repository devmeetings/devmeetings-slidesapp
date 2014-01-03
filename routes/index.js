
var yaml = require('js-yaml');

var fs = require('fs');

var slidesDir = './public/slides/';
/*
 * GET home page.
 */
exports.index = function(req, res){
  fs.readdir(slidesDir, function(err, files){
        var slidesets = files.filter(function(file){
            return /\.yaml$/.test(file);
        }).map(function(file) {
            var content = require('../'+slidesDir+file);

            var name = file.replace(/\.yaml$/, ''); 
            return {
                name: name,
                title: content.title,
                count: content.slides.length
            };
        });
        res.render('index', {
            title: 'Welcome to Slider',
            slidesets: slidesets
        });
  });
};

exports.uploadSlides = function(req, res) {
    var shortName = req.body.name;
    var file = req.files.yaml;

    var path = slidesDir+shortName+'.yaml';

    if (file.type !== 'application/x-yaml') {
        res.send(400, "Only yaml files are accepted.");
        return;
    }

    fs.readFile(file.path, function(err, data){
        if (err) {
            res.send(400, "Cannot read uploaded file.");
            return;
        }
        try {
            yaml.safeLoadAll(""+data, function(a){
                console.log(a);
            }, {});
        } catch (e) {
            console.error(e);
            res.send(400, "Uploaded yaml file is invalid: "+e);
            return;
        }

        fs.writeFile(path, data, function(err){
            res.redirect('/'+shortName);
        });
    });

};

exports.slider = function(req, res) {
  var name = req.params.file;
  fs.exists(slidesDir + name + '.yaml', function(exists){
    if (exists) {  
      res.render('slider', {
        title: 'Slider',
        presentationFile: name
      });
    } else {
      res.send(404);
    }
  });
};

var normalizeSlide = function(slide) {
    if (slide.code) {
        if (!slide.code.language) {
            slide.code = {
                language: 'javascript',
                content: slide.code
            };
        }
        slide.code.content = slide.code.content.trim();
    }
};

exports.slide = function(req, res) {
    try {
        var slide = JSON.parse(req.query.slide);
        normalizeSlide(slide);
        res.render('slide', slide);
    } catch(e) {
        res.render('slide-empty');
    }
};
exports.trainer = function(req, res) {
    res.render('trainers');
};