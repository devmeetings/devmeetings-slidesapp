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
        timestamp: {
            type: Number   
        },
        length: {
            type: Number        
        },
        videodata: {
            type: [Schema.Types.Mixed]
        }
    }]
});


module.exports = mongoose.model('training', Training);
