/* jshint esnext:true */
const Todos = new Mongo.Collection("test");
Todos.attachSchema(new SimpleSchema({
  text: {
    type: String,
    label: 'Todos'
  }
})); 

if (Meteor.isServer) {
  Meteor.publish('todos', function() {
    return Todos.find();
  });
}

this.Todos = Todos;
