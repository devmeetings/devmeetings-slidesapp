var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Snapshot = new Schema({
  deckId: Schema.ObjectId,
  slideId: Schema.ObjectId,
  userId: String,
  timestamp: Schema.Types.Mixed,
  data: Schema.Types.Mixed
});

Snapshot.virtual('date')
  .get(function () {
    return this._id.getTimestamp();
  });

module.exports = mongoose.model('Snapshot', Snapshot);
