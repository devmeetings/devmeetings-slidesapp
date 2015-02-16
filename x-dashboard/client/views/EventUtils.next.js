/* jshint esnext:true */

this.EventUtils = {
  timeLeft(currentItem) {
      if (!currentItem) {
        return 0;
      }
      let currentTime = Session.get('currentTime');
      currentItem.endTime = currentItem.endTime || new Date().getTime();
      let timeLeft2 = (currentItem.endTime - currentTime) / 1000 / 60;
      return timeLeft2.toFixed(1);
    },

    textClass(currentItem) {
      let time = EventUtils.timeLeft(currentItem);
      if (time < 3) {
        return 'danger';
      }
      if (time < 7) {
        return 'warning';
      }
      return 'success';
    },

    mapItems(ev) {
      Events.listen('tpl.eventRow.changed');

      var isPlanning = Session.get('isPlanning');
      var time = isPlanning ? ev.eventDate.getTime() : Session.get('currentTime');

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

    updateCurrentTime: function updateCurrentTime() {
      Session.set('currentTime', new Date().getTime());
      Meteor.setTimeout(updateCurrentTime, 2000);
    }
};

this.EventUtils.updateCurrentTime();
