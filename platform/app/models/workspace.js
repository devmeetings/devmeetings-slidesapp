var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Workspace = new Schema({
    hash: String,
    authorId: Schema.ObjectId,
    files: Schema.Types.Mixed,
    lastAccessTime: Date,
    accessedBy: [Schema.ObjectId]
});

module.exports = mongoose.model('workspace', Workspace);