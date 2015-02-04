var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShortlinkSchema = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('shortlink', ShortlinkSchema);
