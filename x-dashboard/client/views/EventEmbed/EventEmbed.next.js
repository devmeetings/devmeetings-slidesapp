/* jshint esnext:true */


Template.EventEmbed.helpers({
  currentItem() {
      let ev = this.event;
      return _.find(EventUtils.mapItems(ev), (item) => {
        return item.startedAt && !item.finishedAt;
      });
    },
  
    progressPrcnt(currentItem) {
      return EventUtils.progress(currentItem) * 100;
    },

    timeLeft(currentItem) {
      return EventUtils.timeLeft(currentItem);
    },

    textClass(currentItem) {
      return EventUtils.textClass(currentItem);
    }
});
