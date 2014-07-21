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
            url: {
                type: String
            },
            timestamp: {
                type: Number   
            },
            length: {
                type: Number        
            }
        },
        taskdata: {
            slide: {
                type: String       
            }
        }
    }]
});


module.exports = mongoose.model('training', Training);
