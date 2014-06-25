var mongoose = require('mongoose');
Schema = mongoose.Schema;

var UserSchema = new Schema({
    userId: {
        type: String,
        index: {
            unique: true
        }
    },
    name: String,
    email: String
});

module.exports = mongoose.model('User', UserSchema);
