/* jshint esnext:true */

Template.Event.helpers({
  mapItems() {
    Events.listen('tpl.eventRow.changed');
    var ev = this.event;
    return ev.items.reduce((memo, x, k) => {
      x.actualTime = x.actualTime || x.time;

      var endTime = memo.startTime + x.actualTime * 60 * 1000;
      x.startTime = new Date(memo.startTime);
      x.endTime = new Date(endTime);
      x.parent = ev;
      x.idx = k;
      return {
        items: memo.items.concat(x),
        startTime: endTime
      };
    }, {
      items: [],
      startTime: ev.startTime.getTime ? ev.startTime.getTime() : 0
    }).items;
  }
});
