var Client = require('mongodb').MongoClient;


Client.connect('mongodb://localhost:27017/konkurs', function(err, db) {
    if (err) throw err;

    exports.code = db.collection('code');
    exports.submit = db.collection('submit');
});