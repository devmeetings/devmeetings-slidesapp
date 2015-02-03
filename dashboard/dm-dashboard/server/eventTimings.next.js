/*jshint esnext:true */
Meteor.publish('events', function() {
  return EventTimings.find({});
});
