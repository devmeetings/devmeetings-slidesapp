module.exports = function(app) {

    //home route
    var slider = require('../app/controllers/slider');
    app.get('/', slider.index);
    app.get('/slide-:slide', slider.slide);

};