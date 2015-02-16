/* jshint esnext:true */

Template.Event.helpers({

  isAdmin() {
      return Meteor.userId() === this.event.authorId;
    },

    mapItems() {
      var ev = this.event;
      return EventUtils.mapItems(ev);
    },

    currentItem() {
      var ev = this.event;
      return _.find(ev.items, item => item.startedAt && !item.finishedAt);
    }
});

Template.Event.events({
  'click button[role="togglePlanningMode"]': (ev) => {
    const isPlanning = Session.get('isPlanning');
    Session.set('isPlanning', !isPlanning);
  },
  'click button[role="finishEvent"]': (ev, tpl) => {
    const eve = tpl.data.event;
    const l = eve.items.length;
    let lastItem = eve.items[l - 1];
    Meteor.call('EventTimings.finishEvent', eve._id, lastItem.idx, new Date());
  }
});
