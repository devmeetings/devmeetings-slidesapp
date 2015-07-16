var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SlideSchema = new Schema({
  parentId: Schema.ObjectId,
  name: {
    type: String,
    unique: true
  },
  content: Schema.Types.Mixed
});

SlideSchema.virtual('date')
  .get(function () {
    return this._id.getTimestamp();
  });

module.exports = mongoose.model('slide', SlideSchema);
