var _ = require('lodash');
var Workspaces = require('../../services/workspaces');
var crypto = require('crypto');
var mime = require('mime');



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

            try {
                var zip = new require('node-zip')(data, {
                    base64: false,
                    checkCRC32: true
                });

                res.send(200, _.reduce(zip.files, function(memo, val, name) {
                    if (val._data) {
                        memo[getInternalFileName(name)] = val._data;
                    }
                    return memo;
                }, {}));
            } catch (e) {
                res.send(400, e);
            }
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
            var file = findFile(workspace.files, internalFile);
            if (!workspace || !file) {
                res.send(404);
                return;
            }

            res.set('Content-Type', guessType(internalFile));
            res.send(file);
        }, console.error);
    });
};

function findFile(files, fileName) {
    if (files[fileName]) {
        return files[fileName];
    }
    // Try preprocessing some files
    var nameParts = fileName.split('|');
    var l = nameParts.length;
    var ext = nameParts[l - 1];

    var extensionsToTry = [];
    // Try jade
    if (ext === 'html') {
        extensionsToTry = ['jade'];
    }
    // Try coffee
    if (ext === 'js') {
        extensionsToTry = ['coffee', 'es6'];
    }

    return extensionsToTry.map(function(ext) {
        nameParts[l - 1] = ext;
        var file = files[nameParts.join('|')];
        if (file) {
            try {
                return processFile(ext, file);
            } catch (e) {
                return e.toString();
            }
        }
    }).filter(function(x) {
        return !!x;
    })[0];
}

function processFile(ext, content) {
    if (ext === 'jade') {
        return require('jade').render(content, {});
    }
    if (ext === 'coffee') {
        return require('coffee-script').compile(content);
    }
    if (ext === 'es6') {
        return require('traceur').compile(content, {});
    }
    return content;
}

function guessType(fileName) {
    var name = fileName.split('|');
    var ext = name[name.length - 1];
    return mime.lookup(ext);
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