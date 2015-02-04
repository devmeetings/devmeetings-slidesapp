var glob = require('glob'),
    Q = require('q'),
    Recording = require('../models/recording');


var Editor = {
    soundsList: function (req, res) {
        Q.nfcall(glob, 'public/sounds/*.ogg').then( function (files) {

            files = files.map(function(file) {
                return file.replace(/public/,'/static');
            });
            res.send(files);
        });
    },
    recList: function (req, res) {
        Recording.find({}).select('title group _id').exec().then( function (recordings) {
            res.send(recordings);
        });
    }
};

module.exports = Editor; 
