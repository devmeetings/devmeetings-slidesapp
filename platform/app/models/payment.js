var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Payment = new Schema({
    user: {
        name: String,
        email: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    }, 
    course: String,
    price: Number,
    subscription: Boolean
});


module.exports = mongoose.model('payment', Payment);
