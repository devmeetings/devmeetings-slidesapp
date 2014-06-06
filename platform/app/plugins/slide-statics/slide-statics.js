exports.initApi = function(preffix, app, authenticated) {

    app.get(preffix + 'static', authenticated, function(req, res) {
        var page = req.query.p;
        console.log(req.query);
        if (page) {
            res.set('Content-Type', 'text/html');
            res.set('Cache-Control', 'max-age=2592000000');
            res.send(200, new Buffer(page.replace(/ /g, '+'), 'base64'));
        } else {
            res.send(400, "Missing 'p' parameter.");
        }
    });
};