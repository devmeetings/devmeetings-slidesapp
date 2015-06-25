var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Event = new Schema({
  title: String,
  name: {
    type: String,
    unique: true
  },
  removed: Boolean,
  image: String,
  order: Number,
  description: String,
  liveLink: String,
  visible: Boolean,
  pin: Number,
  shouldRedirectToUnsafe: Boolean,

  links: [{
    name: String,
    isExternal: Boolean,
    url: String,
    slideId: {
      type: Schema.Types.ObjectId,
      ref: 'slide'
    }
  }],
  
  baseSlide: {
    type: Schema.Types.ObjectId,
    ref: 'slide'
  },

  iterations: [{
    title: String,

    materials: [{
      title: String,
      url: String,

      material: {
        type: Schema.Types.ObjectId,
        ref: 'recording'
      },

      annotations: {
        type: Schema.Types.ObjectId,
        ref: 'annotations'
      },

      annotationsMergeWithAuto: Boolean,

      deck: {
        deck: {
          type: Schema.Types.ObjectId,
          ref: 'decks'
        },
        from: {
          type: Schema.Types.ObjectId,
          ref: 'slides'
        },
        to: {
          type: Schema.Types.ObjectId,
          ref: 'slides'
        }
      }
    }],

    tasks: [{
      title: String,
      url: String,
      noOfTasks: Number
    }]

  }]
});

module.exports = mongoose.model('event', Event);
