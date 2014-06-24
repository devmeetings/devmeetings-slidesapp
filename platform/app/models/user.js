var mongoose = require('mongoose');

var UserSchema = new Schema({
    userId: {
        type: String,
        index: {
            unique: true
        }
    },
    name: String
});

module.exports = mongoose.model('User', UserSchema);