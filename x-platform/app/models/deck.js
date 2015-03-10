// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeckSchema = new Schema({
    title: String,
    name: {
      type: String,
      unique: true
    },
    slides: [String]
});

DeckSchema.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('deck', DeckSchema);
