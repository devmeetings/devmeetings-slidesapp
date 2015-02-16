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
  eventDate: {
    type: Date,
    label: 'Event Date',
    autoform: {
      type: 'datetime-local'
    }
  },
  authorId: {
    type: String,
    label: 'Author Id',
    optional: true
  },
  announcement: {
    type: String,
    label: 'Announcement',
    optional: true
  },
  items: {
    type: [Object]
  },
  "items.$.title": {
    type: String,
    label: 'Title'
  },
  "items.$.link": {
    type: String,
    label: 'URL',
    optional: true
  },
  "items.$.icon": {
    type: String,
    label: 'Icon'
  },
  "items.$.time": {
    type: Number,
    label: 'Time [minutes]'
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


function updateEventProp(eventId, itemIdx, prop, val) {
  let update =  {
    $set: {
      ['items.' + itemIdx + '.' + prop]: val
    }
  };
  EventTimings.update(eventId, update);
}

Meteor.methods({

  "EventTimings.updateTime": (eventId, itemIdx, newTime) => {
    updateEventProp(eventId, itemIdx, 'time', newTime);
  },

  "EventTimings.startItem": (eventId, itemIdx, startTime) => {
    if (itemIdx > 0) {
      updateEventProp(eventId, itemIdx - 1, 'finishedAt', startTime);
    }
    updateEventProp(eventId, itemIdx, 'startedAt', startTime);
  },

  "EventTimings.finishEvent": (eventId, itemIdx, startTime) => {
    updateEventProp(eventId, itemIdx, 'finishedAt', startTime);
  },

  "EventTimings.cancelItem": (eventId, itemIdx) => {
    EventTimings.update(eventId, {
      $unset: {
        ['items.' + itemIdx + '.startedAt']: ""
      }
    });
  }

});
