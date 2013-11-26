
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: 'Slider'});
};

exports.slide = function(req, res) {
    try {
        var slide = JSON.parse(req.query.slide);
        res.render('slide', slide);
    } catch(e) {
        res.render('slide-empty');
    }
};