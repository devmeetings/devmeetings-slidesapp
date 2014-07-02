var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Recording = new Schema({
    slideId: String,
    slides: [Schema.Types.Mixed]
});

Recording.virtual('date')
    .get( function () {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('Recording', Recording);

