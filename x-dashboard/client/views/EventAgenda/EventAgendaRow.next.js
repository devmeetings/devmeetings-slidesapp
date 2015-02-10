/* jshint esnext:true */


Template.EventAgendaRow.helpers({
  
    rowClass() {
      var started = this.startedAt;
      var finished = this.finishedAt;
      if (started && !finished) {
        return 'active';
      }
      return '';
    }

});
