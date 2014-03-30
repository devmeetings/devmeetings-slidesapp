module.exports = function(app) {
    var ctrl = function(ctrlName) {
      return require('../app/controllers/'+ctrlName);
    };

    // API
    var decks = ctrl('decks');
    app.get('/api/decks', decks.list);
    app.post('/api/decks', decks.create);
    app.delete('/api/decks/:id', decks.delete);

    //home route
    var slider = ctrl('slider');
    app.get('/', slider.index);
    app.get('/edit', slider.edit);
    app.get('/trainer', slider.trainer);
    app.get('/slide-:slide', slider.slide);
    app.get('/edit:slide-:slide', slider.slide);

    var admin = ctrl('admin');
    app.get('/admin/', admin.index);
    app.get('/admin/partials/:name', admin.partials);
};