var mongoose = require('mongoose');

module.exports = mongoose.model('user', new mongoose.Schema({
    userId: {
        type: String, 
        required: true
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
        enum: ['local', 'g+', 'fb', 'github'], 
        default: 'local' 
    },
    verified: {
        type: Boolean,
        default: false 
    },
    acl: { 
        type: [String],
        enum: ['admin:super', 'admin:slides', 'admin:events', 'trainer', 'student'], 
        default: 'student'
    },
    added: {
        type: Date, 
        default: Date.now 
    },
    bio: {
        type: String     
    },
    avatar: {
        type: String        
    }
}));