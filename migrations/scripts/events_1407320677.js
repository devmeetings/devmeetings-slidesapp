db.users.find({}).toArray().forEach( function (user) {
    db.events.update({
        "peopleStarted.userId": user._id
    }, {
        $set: {
            "peopleStarted.$.name": user.name
        }
    }, {
        multi: true
    });
    db.events.update({
        "peopleFinished.userId": user._id
    }, {
        $set: {
            "peopleFinished.$.name": user.name
        }
    }, {
        multi: true
    });
})
