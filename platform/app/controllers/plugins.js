var glob = require('glob');

exports.paths = function(req, res){
    glob("public/plugins/**/*.js", function(err, files) {
        if (err) {
            res.send(404, err);
            return;
        }
        files = files.map(function(file) {
            file = file.substring(0, file.length - 3); // trim '.js'
            return file.substring(7, file.length); // trim public/ 
        });
        res.set('Content-Type', 'application/js');
        res.send("define( []," + JSON.stringify(files) + ");"); // TODO dla todr!
    });
};

