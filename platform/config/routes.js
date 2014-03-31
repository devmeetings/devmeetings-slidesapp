module.exports = function(app) {
    var ctrl = function(ctrlName) {
      return require('../app/controllers/'+ctrlName);
    };

    // API
    var decks = ctrl('decks');
    app.get('/api/decks', decks.list);
    app.post('/api/decks', decks.create);
    app.delete('/api/decks/:id', decks.delete);
    // TODO OMG this is so terrible
    app.get('/decks/:id.js', decks.getOneRequireJs);

    //home route
    var slider = ctrl('slider');
    app.get('/', slider.index);
    app.get('/slides/:slides', slider.deck);
    app.get('/slides/:slides/edit', slider.edit);
    app.get('/slides/:slides/trainer', slider.trainer);
    app.get('/slides/:slides/slide-:slide', slider.slide);
    app.get('/slides/:slides/edit:slide-:slide', slider.slide);

    var admin = ctrl('admin');
    app.get('/admin/', admin.index);
    app.get('/admin/partials/:name', admin.partials);
};