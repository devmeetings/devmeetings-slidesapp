var Client = require('mongodb').MongoClient;


Client.connect('mongodb://localhost:27017/konkurs', function(err, db) {
    if (err) throw err;

    export.code = db.collection('code');
    export.submit = db.collection('submit');
});