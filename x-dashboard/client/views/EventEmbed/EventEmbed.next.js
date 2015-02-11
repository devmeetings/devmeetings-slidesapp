/* jshint esnext:true */


Template.EventEmbed.helpers({
  currentItem() {
      let ev = this.event;
      return _.find(EventUtils.mapItems(ev), (item) => {
        return item.startedAt && !item.finishedAt;
      });
    },

    timeLeft(currentItem) {
      return EventUtils.timeLeft(currentItem);
    },

    textClass(currentItem) {
      return EventUtils.textClass(currentItem);
    }
});
