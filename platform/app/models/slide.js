var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var SlideSchema = new Schema({
    title: String,
    body: String,
    author: String
});

SlideSchema.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('Slide', SlideSchema);
