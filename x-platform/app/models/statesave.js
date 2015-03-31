var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Statesave = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  previousState: {
    type: Schema.Types.ObjectId,
    ref: 'statesave'
  },
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: 'slidesave'
  },
  originalTimestamp: Date,
  original: {
    type: Schema.Types.Mixed
  },

  patches: [{
    timestamp: {
      type: Number
    },
    patch: {
      type: Schema.Types.Mixed
    }
  }],

  currentTimestamp: Date,
  current: {
    type: Schema.Types.Mixed
  },

});

module.exports = mongoose.model('statesave', Statesave);
