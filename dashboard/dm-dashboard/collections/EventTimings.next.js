/* jshint esnext:true */
const EventTimings = new Mongo.Collection("eventTiming");
EventTimings.attachSchema(new SimpleSchema({
  eventTitle: {
    type: String,
    label: 'Event Title',
  },
  id: {
    type: String,
    label: 'Short id',
    index: true,
    unique: true
  },
  startTime: {
    type: Date,
    label: 'Start Time',
    autoform: {
      type: 'datetime-local'
    }
  },
  items: {
    type: [Object]
  },
  "items.$.title": {
    type: String,
    label: 'Title'
  },
  "items.$.category": {
    type: String,
    label: 'Category'
  },
  "items.$.time": {
    type: Number,
    label: 'Time [minutes]'
  },
  "items.$.actualTime": {
    type: Number,
    label: 'Actual Time [minutes]',
    optional: true
  },
  "items.$.startedAt": {
    type: Date,
    label: 'Started At',
    optional: true,
    autoform: {
      type: 'datetime-local'
    }
  },
  "items.$.finishedAt": {
    type: Date,
    label: 'Finished At',
    optional: true,
    autoform: {
      type: 'datetime-local'
    }
  }

}));

this.EventTimings = EventTimings;

Meteor.methods({

  "EventTimings.updateTime": (eventId, itemId, newTime) => {
    EventTimings.update(eventId, {
      $set: {
        ['items.' + itemId + '.actualTime']: newTime
      }
    });
  }

});
