var CommentModel = require('../models/comment');


exports.create = function (req, res) {
    var d = new CommentModel(req.body);
    d.save(function (err, comment) {
        if (err) {
            console.error(err);
            res.send(500, err);
            return;
        }
        res.send(comment);
    });
};

exports.createFromSocket = function (socket) {

};

exports.list = function (req, res) {
    var query = CommentModel.find();
    if(req.params.presentation)
    {
        query.where('presentation').equals(req.params.presentation);
    }
    if(req.params.slide)
    {
        query.where('presentation').where('slide').equals(req.params.slide);
    }

    query.exec(function (err, comments) {
        if (err) {
            console.error(err);
            res.send([]);
            return;
        }
        res.send(comments);
    });
};

exports.delete = function (req, res) {
    CommentModel.findByIdAndRemove(req.params.id, function (err, comment) {
        if (err) {
            res.send(404, err);
            return;
        }
        res.send(200);
    });
};

exports.edit = function (req, res) {
    CommentModel.findByIdAndUpdate(req.params.id, req.body, {upsert: true}, function (err, comment) {
        if (err) {
            res.send(404, err);
            return;
        }
        res.send(200);
    });
};
