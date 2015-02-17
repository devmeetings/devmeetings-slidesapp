/* jshint esnext:true */
this.AdminConfig = {
  name: 'EventTimings',
  baseRoute: '/live/admin/admin',
  adminEmails: ['tomasz.drwiega@gmail.com', 'maciek.zir@gmail.com'],
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

  this.route('event-agenda', {
    path: '/live/:id/agenda',
    waitOn: function() {
      return Meteor.subscribe('events');
    },
    onBeforeAction: function() {
      $('body').addClass('embed');
      this.next();
    },
    onStop: function() {
      $('body').removeClass('embed');
    },
    action: function() {
      this.render('EventAgenda', {
        data: {
          event: EventTimings.findOne({
            id: this.params.id
          })
        }
      });
    }
  });

  this.route('event-embed', {
    path: '/live/:id/embed',
    waitOn: function() {
      return Meteor.subscribe('events');
    },
    onBeforeAction: function() {
      $('body').addClass('embed-small');
      this.next();
    },
    onStop: function() {
      $('body').removeClass('embed-small');
    },
    action: function() {
      this.render('EventEmbed', {
        data: {
          embedBig: false,
          event: EventTimings.findOne({
            id: this.params.id
          })
        }
      });
    }
  });


  this.route('event-embedBig', {
    path: '/live/:id/embedBig',
    waitOn: function() {
      return Meteor.subscribe('events');
    },
    onBeforeAction: function() {
      $('body').addClass('embed-small');
      this.next();
    },
    onStop: function() {
      $('body').removeClass('embed-small');
    },
    action: function() {
      this.render('EventEmbed', {
        data: {
          embedBig: true,
          event: EventTimings.findOne({
            id: this.params.id
          })
        }
      });
    }
  });


  this.route('event-ranking', {
    path: '/live/:id/ranking',
    waitOn: function() {
      return Meteor.subscribe('events');
    },
    onBeforeAction: function() {
      $('body').addClass('embed');
      this.next();
    },
    onStop: function() {
      $('body').removeClass('embed');
    },
    action: function() {
      this.render('EventRanking', {
        data: {
          event: EventTimings.findOne({
            id: this.params.id
          })
        }
      });
    }
  });


});
