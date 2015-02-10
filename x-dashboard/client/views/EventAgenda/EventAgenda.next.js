/* jshint esnext:true */

Template.EventAgenda.helpers({
  mapItems() {
    var ev = this.event;
    return EventUtils.mapItems(ev);
  }
});
