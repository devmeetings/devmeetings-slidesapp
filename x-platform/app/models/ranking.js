var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Ranking = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event',
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true
  },
  data: {
    type: Schema.Types.Mixed
  /*
   *    taskIdx: {
   *      isDone,
   *      date
   *    }
   */
  },
  counts: {
    type: Schema.Types.Mixed
  /*
   * iterationIdx -> count
   */
  }
});

module.exports = mongoose.model('ranking', Ranking);
