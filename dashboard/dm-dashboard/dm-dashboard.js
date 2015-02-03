var Todos = new Mongo.Collection("test");

if (Meteor.isClient) {

  Template.hello.helpers({
    todos: function() {
      return Todos.find({});
    }
  });

  Template.hello.events({
    'submit [role="new-task"]': function(ev) {
      var $input = ev.target.text;
      Todos.insert({
        text: $input.value,
        completed: false
      });
      $input.value = '';

      return false;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
