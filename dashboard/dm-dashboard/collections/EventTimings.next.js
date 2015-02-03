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
    label: 'Start Time'
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
  "items.$.timeLeft": {
    type: Number,
    label: "Time left [minutes]"
  }
}));

this.EventTimings = EventTimings;
