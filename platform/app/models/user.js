var mongoose = require('mongoose');

module.exports = mongoose.model('user', new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
        default: new mongoose.Types.ObjectId()
    },
    name: {
        type: String,
        required: true 
    },
    email: { 
        type: String 
    },
    password: { 
        type: String 
    },
    type: { 
        type: String,
        enum: ['local', 'g+', 'fb'], 
        default: 'local' 
    },
    verified: {
        type: Boolean,
        default: false 
    },
    acl: { 
        type: [String],
        enum: ['admin', 'teacher', 'student'], 
        default: 'student'
    },
    added: {
        type: Date, 
        default: Date.now 
    },
    bio: {
        type: String     
    }
}));
