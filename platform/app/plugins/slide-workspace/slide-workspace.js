var _ = require('lodash');
var Workspaces = require('../../services/workspaces');
var crypto = require('crypto');

exports.onSocket = function(log, socket, io) {

    socket.on('slide.slide-workspace.change', function(data, ack) {
        var files = getFiles(data);
        var hash = calculateHash(files);

        var upsert = Workspaces.upsertWorkspace(hash, files, socket.handshake.user._id);

        upsert.then(function(obj) {

            ack({
                ok: true,
                hash: hash
            });
        }, function(err) {

            ack({
                ok: false,
                err: err
            });
        });
    });
};

exports.initApi = function(prefix, app, authenticated) {
    app.post(prefix + "upload", authenticated, function(req, res) {
        require('fs').readFile(req.files.file.path, 'binary', function(err, data) {
            if (err) {
                res.send(400, err);
                return;
            }

            var zip = new require('node-zip')(data, {
                base64: false,
                checkCRC32: true
            });

            res.send(200, _.reduce(zip.files, function(memo, val, name) {
                memo[name] = val._data;
                return memo;
            }, {}));
        });
    });

    app.get(prefix + "download/:hash", authenticated, function(req, res) {
        Workspaces.findByHash(req.params.hash).then(function(workspace) {
            // Create zip file
            var zip = new require('node-zip')();
            _.each(workspace.files, function(val, name) {
                zip.file(getRealFileName(name), val);
            });

            var data = zip.generate({
                base64: false,
                compression: 'DEFLATE'
            });

            res.charset = 'utf8';
            res.set({
                'Content-type': 'application/zip',
                'Content-disposition': 'attachment; filename="' + req.params.hash + '.zip"'
            });
            res.send(new Buffer(data, 'binary'));

        }, function(err) {
            res.send(400, err);
        }).then(null, console.error);
    });
    app.get(prefix + "page/:hash/:file?*", function(req, res) {
        var file = req.params.file || "index.html";
        var first = req.params[0];

        if (first && first !== "/") {
            file = file + first;
        }

        var internalFile = getInternalFileName(file);

        Workspaces.findByHash(req.params.hash).then(function(workspace) {
            if (!workspace || !workspace.files[internalFile]) {
                res.send(404);
                return;
            }

            res.set('Content-Type', guessType(internalFile));
            res.send(workspace.files[internalFile]);
        }, console.error);
    });
};

function guessType(fileName) {
    var ext = fileName.split('|')[1];
    var map = {
        'html': 'text/html',
        'js': 'application/javascript',
        'css': 'text/css',
        'json': 'application/json'
    };
    return map[ext] || 'text/plain';
}

function getInternalFileName(file) {
    return file.replace(/\./g, '|');
}

function getRealFileName(file) {
    return file.replace(/\|/g, '.');
}

function getFiles(data) {
    var files = {};

    _.each(data.tabs, function(val, key) {
        files[key] = val.content;
    });
    return files;
}

function calculateHash(files) {
    var content = JSON.stringify(files);
    var shasum = crypto.createHash('sha1');
    shasum.update(content);
    return shasum.digest('hex');
}