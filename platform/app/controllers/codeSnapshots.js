var CodeSnapshotModel = require('../models/codeSnapshot');

exports.update = function (req, res) {
    // TODO: userId to be added

    var conditions = { 
        userName: req.user.name, 
        slideId: req.body.codeSnapshot.slide 
    } 
    var update = { 
        $addToSet: { 
            "snapshot": req.body.codeSnapshot.snapshot
        } 
    }
    var options = {
        upsert: true
    };

    CodeSnapshotModel.update(conditions, update, options, function(err, codeSnapshot) {
        // console.log('updated in db');        
    });

};