/* jshint esnext:true */

const updateTimeLater = _.debounce(function(item, val) {
  Meteor.call("EventTimings.updateTime", item.parent._id, item.idx, val);
}, 1000);

const updateGuiLater = _.debounce(function() {
  Events.trigger('tpl.eventRow.changed');
}, 500);


Template.EventRow.events({

  'input [role="item-time"]': (ev, tpl) => {
    const item = tpl.data;
    let val = parseFloat(ev.currentTarget.innerHTML);
    if (isNaN(val)) {
      val = 0;
    }
    item.time = val;

    updateGuiLater();
    updateTimeLater(item, val);
  },

  'click [role="cancel-timer"]': (ev, tpl) => {
    const item = tpl.data;
    Meteor.call("EventTimings.cancelItem", item.parent._id, item.idx);
  },

  'click [role="start-timer"]': (ev, tpl) => {
    let item = tpl.data;
    Meteor.call("EventTimings.startItem", item.parent._id, item.idx, new Date());
    let i = _.clone(item);
    delete i.parent;
  }

});
