var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Training = new Schema({
    title: String,
    chapters: [{
        title: {
            type: String 
        }, 
        mode: {
            type: String,
            enum: ['video' , 'task']
        },
        videodata: {
            timestamp: {
                type: Number   
            },
            length: {
                type: Number        
            }
        }
    }]
});


module.exports = mongoose.model('training', Training);
