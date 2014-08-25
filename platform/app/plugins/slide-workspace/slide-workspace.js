var _ = require('lodash');
var Workspaces = require('../../services/workspaces');
var crypto = require('crypto');

exports.onSocket = function(log, socket, io) {

    socket.on('slide.slide-workspace.change', function(data, ack) {
        var files = getFiles(data);
        var hash = calculateHash(files);

        var upsert = Workspaces.upsertWorkspace(hash, files, socket.handshake.user.userId);

        upsert.then(function(obj) {

            ack({
                ok: true,
                hash: hash
            });
        }, function() {

            ack({
                ok: false
            });
        });
    });
};

exports.initApi = function(prefix, app, authenticated) {
    app.get(prefix + "page/:hash/:file?", authenticated, function(req, res) {
        var file = req.params.file || "index.html";
        var internalFile = getInternalFileName(file);

        Workspaces.findByHash(req.params.hash).then(function(workspace) {
            console.dir(workspace);
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
    var x = reverseString(file).replace('.', '|');
    return reverseString(x);
}

function reverseString(string) {
    return string.split("").reverse().join("");
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