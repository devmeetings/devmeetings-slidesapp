/* jshint esnext:true */

Template.EventRowDetails.helpers({
  endTime2() {
      // Not refreshing?
      Session.get('currentTime');
      return this.endTime;
    },

    timeLeft() {
      let current = this;
      let time = Session.get('currentTime');
      current.endTime = current.endTime || new Date().getTime();
      let timeLeft2 = (current.endTime - time) / 1000 / 60;

      return timeLeft2.toFixed(1);
    }
});
