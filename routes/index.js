
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: 'Slider'});
};

exports.slides = function(req, res) {
  var data = {
    title: 'Slide 1',
    code: 'function foo(items) {\n' + 'var x = "All this is syntax highlighted" + items;\n' + 'return x;\n}\nvar x = {name: foo("something")};',
    monitor : 'x'
  };

  res.render('slide', data);
};