// CodeSnapshot model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CodeSnapshotSchema = new Schema({
  userId: String,
  slideId: String,
  snapshots: [
  // {
  // 	slide: slideId,
  // 	snapshots: [
  // 		{ 
  // 			delay: 23123123, 
  //			code : 'qweqweqwe'
  //		}
  // 	]
  // }
  ]
});

CodeSnapshotSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

module.exports = mongoose.model('CodeSnapshots', CodeSnapshotSchema);
