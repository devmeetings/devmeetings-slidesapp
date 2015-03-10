var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Workspace = new Schema({
  hash: {
    type: String,
    unique: true
  },
  authorId: Schema.ObjectId,
  files: Schema.Types.Mixed,
  lastAccessTime: Date,
  accessedBy: [Schema.ObjectId]
}, {
  capped: {
    max: 10*1000,
    size: 1024*1024*1024*0.5 //0.5GB?
  }
});

module.exports = mongoose.model('workspace', Workspace);
