var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Ranking = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'event',
    index: true
  },
  userId: {
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
  }
});

module.exports = mongoose.model('ranking', Ranking);
