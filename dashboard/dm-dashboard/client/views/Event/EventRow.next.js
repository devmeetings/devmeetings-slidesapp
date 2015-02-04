/* jshint esnext:true */

const updateTimeLater = _.debounce(function(item, val) {
  Meteor.call("EventTimings.updateTime", item.parent._id, item.idx, val);
}, 1000);
const updateGuiLater = _.debounce(function() {
  Events.trigger('tpl.eventRow.changed');
}, 500);

Template.EventRow.events({

  'input [role="item-time"]': (ev, tpl) => {
    var item = tpl.data;
    var val = parseFloat(ev.currentTarget.innerHTML);
    if (isNaN(val)) {
      val = 0;
    }
    item.actualTime = val;

    updateGuiLater();
    updateTimeLater(item, val);
  }

});
