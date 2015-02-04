/* jshint esnext:true */

class Events {
  
  trigger(evName) {
    Session.set('events.' + evName, new Date());
  }

  listen(evName) {
    Session.get('events.' + evName);
  }
  
}



this.Events = new Events();
