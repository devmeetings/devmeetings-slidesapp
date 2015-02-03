/* jshint esnext:true */
Template.EventsList.helpers({
  events() {
    return EventTimings.find({});
  }
});
