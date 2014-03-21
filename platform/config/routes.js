module.exports = function(app) {

    //home route
    var slider = require('../app/controllers/slider');
    app.get('/', slider.index);
    app.get('/edit', slider.edit);
    app.get('/slide-:slide', slider.slide);
    app.get('/edit:slide-:slide', slider.slide);
};