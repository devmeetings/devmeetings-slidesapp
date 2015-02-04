/* jshint esnext:true */

function updateCurrentTime() {
  Session.set('currentTime', new Date().getTime());
  Meteor.setTimeout(updateCurrentTime, 2000);
}

updateCurrentTime();

Template.Event.helpers({

  mapItems() {
      Events.listen('tpl.eventRow.changed');

      var ev = this.event;
      var time = Session.get('currentTime');

      return ev.items.reduce((memo, x, k) => {
        var startTime = x.startedAt ? x.startedAt.getTime() : memo.startTime;

        var endTime = startTime + x.time * 60 * 1000;
        x.startTime = new Date(startTime);
        x.endTime = new Date(endTime);
        x.parent = ev;
        x.idx = k;
        x.isNext = !x.startedAt && memo.isNext;

        var nextTime = endTime > time ? endTime : time;
        return {
          items: memo.items.concat(x),
          startTime: nextTime,
          isNext: x.isNext ? false : memo.isNext
        };
      }, {
        items: [],
        startTime: time,
        isNext: true
      }).items;
    },



    currentItem() {
      var ev = this.event;
      return _.find(ev.items, item => item.startedAt && !item.finishedAt);
    }
});
