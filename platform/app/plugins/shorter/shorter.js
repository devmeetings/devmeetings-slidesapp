var _ = require('lodash');
var Shortlink = require('../../models/shortlink');

exports.initApi = function(prefix, app, authenticated) {
    app.get("/-:id", function(req, res) {
    	Shortlink.findOne({
    		name: req.params.id
    	}, function(err, obj) {
    		if (err || !obj) {
    			res.send(404, err);
    		} else {
    			res.redirect(obj.url);
    		}
    	});
    });

    app.post("/-:id", authenticated, function(req, res){
    	Shortlink.findOneAndUpdate({
    		name: req.params.id
    	}, {
    		name: req.params.id,
    		url: req.body.url
    	},
    	{
    		upsert: true
    	}, function(err, obj){
    		if (err || !obj) {
    			res.send(400, err);
    		} else {
    			res.send(200);
    		}
    	});
    });
};
