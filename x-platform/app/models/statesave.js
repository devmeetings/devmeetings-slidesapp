var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * This collection should be volatile.
 * It should be safe to remove all documents and app will still work
 */
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
    ref: 'slidesave',
    index: true
  },
  originalTimestamp: Date,
  original: {
    type: Schema.Types.Mixed
  },
  noOfPatches: Number,
  patches: [{
    id: {
      type: String
    },
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
