/* jshint esnext:true */

this.AdminConfig = {
  name: 'App Admin',
  collections: {
    Todos: {
      icon: 'pencil',
      tableColumns: [{
        label: 'Title',
        name: 'text'
      }],
      showWidget: true
    }
  }
};

if (Meteor.isClient) {

  Meteor.subscribe('todos');

  Template.Home.helpers({
    todos() {
      return Todos.find({});
    }
  });

  Template.Home.events({
    'submit [role="new-task"]': (ev) => {
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

Router.map(function() {
  this.route('/', function() {
    this.render('Home');
  });
});
