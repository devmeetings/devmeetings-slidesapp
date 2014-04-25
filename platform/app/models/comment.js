var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    presentation: String,
    slide: String,
    comment: String,
    code: {
        js: String,
        html: String,
        css: String
    },
    timestamp: Number

});

module.exports = mongoose.model('Comment', CommentSchema);