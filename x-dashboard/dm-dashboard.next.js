/* jshint esnext:true */
this.AdminConfig = {
  name: 'EventTimings',
  baseRoute: '/admin2',
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
    path: '/live/',
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

  this.route('login', {
    path: '/live/login',
    action: function(){
      this.render('LoginButtons');
    }
  });

  this.route('event', {
    path: '/live/:id',
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
