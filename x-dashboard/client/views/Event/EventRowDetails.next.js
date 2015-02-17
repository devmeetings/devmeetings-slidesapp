/* jshint esnext:true */

Template.EventRowDetails.helpers({
  endTime2() {
      // Not refreshing?
      Session.get('currentTime');
      return this.endTime;
    },

    progressPrcnt() {
      let current = this;
      return EventUtils.progress(current) * 100;
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
