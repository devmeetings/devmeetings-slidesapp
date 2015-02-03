/* jshint esnext:true */
this.AdminConfig = {
  name: 'EventTimings',
  collections: {
    EventTimings: {
      icon: 'pencil',
      tableColumns: [{
        label: 'Short id',
        name: 'id'
      }, {
        label: 'Title',
        name: 'eventTitle'
      }, {
        label: 'Start',
        name: 'startTime'
      }]
    }
  }
};

Router.map(function() {
  this.route('events', {
    path: '/',
    waitOn: function() {
      return Meteor.subscribe('events');
    },
    action: function() {
      if (this.ready()) {
        this.render('EventsList');
      } else {
        this.render('Loading');
      }
    }
  });

  this.route('event', {
    path: '/events/:id',
    waitOn: function() {
      return Meteor.subscribe('events');
    },
    action: function() {
      this.render('Event', {
        data: {
          event: EventTimings.findOne({
            id: this.params.id
          })
        }
      });
    }
  });
});
