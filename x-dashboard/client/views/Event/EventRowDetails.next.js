/* jshint esnext:true */

Template.EventRowDetails.helpers({
  endTime2() {
      // Not refreshing?
      Session.get('currentTime');
      return this.endTime;
    },

    timeLeft() {
      let current = this;
      return EventUtils.timeLeft(current);
    },

    textClass() {
      let current = this;
      return EventUtils.textClass(current);
    }
});
