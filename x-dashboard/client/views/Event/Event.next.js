/* jshint esnext:true */

Template.Event.helpers({

  mapItems() {
      var ev = this.event;
      return EventUtils.mapItems(ev);
    },

    currentItem() {
      var ev = this.event;
      return _.find(ev.items, item => item.startedAt && !item.finishedAt);
    }
});
