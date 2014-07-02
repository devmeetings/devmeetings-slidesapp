// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeckSchema = new Schema({
    title: String,
    slides: []
});

DeckSchema.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

DeckSchema.formage = {
    singular: 'Deck',
    order_by: ['title']
};

module.exports = mongoose.model('Deck', DeckSchema);
