var Workspace = require('../models/workspace');


function updateAccessTimes(workspace, userId) {
    workspace.lastAccessTime = new Date();
    if (workspace.accessedBy.indexOf(userId) === -1) {
        workspace.accessedBy.push(userId);
    }
    return workspace.save();
}

function insertWorkspace(hash, files, userId) {
    return Workspace.create({
        hash: hash,
        files: files,
        authorId: userId,
        lastAccessTime: new Date(),
        accessedBy: [userId]
    });
}

exports.upsertWorkspace = function(hash, files, userId) {
    return Workspace.findOne({
        hash: hash
    }).exec().then(function(workspace) {
        if (workspace) {
            return workspace;
            //return updateAccessTimes(workspace, userId);
        }
        return insertWorkspace(hash, files, userId);
    });
};

exports.findByHash = function(hash) {
    return Workspace.findOne({
        hash: hash
    }).exec();
};