/* jshint esnext:true */

Template.EventRanking.helpers({
  tasks() {
      let task = this.event.tasks;

      if (!task) {
        return [];
      }

      function t(id, count) {

        let countArr = Array(count).join("x").split("x");

        return {
          id: id,
          name: 'Zadanie ' + id,
          subtasks: countArr.map((task, idx) => {
            return {
              id: id + "-" + idx
            };
          })
        };
      }

      return task.map((x, k) => t(k, x));
    },

    currentUserName() {
      return Meteor.user().username;
    },

    ranking() {
      let ev = this.event;
      return ev.ranking.map((user, idx) => {
        return {
          idx: idx,
          event: ev,
          username: user.username,
          finished: user.finished.reduce((memo, task) => {
            memo[task] = true;
            return memo;
          }, {})
        };
      });
    },

    hasFinished: (finished, taskId) => {
      if (!finished) {
        return;
      }
      return finished[taskId];
    },

    hasFinishedClass: (finished, taskId) => {
      if (!finished) {
        return;
      }
      return finished[taskId] ? 'bg-success' : 'bg-danger';
    },

    currentUserFinished: (event, id) => {
      var userIdx = event.ranking.map(x => x.username).indexOf(Meteor.user().username);
      if (userIdx === -1) {
        return false;
      }
      var user = event.ranking[userIdx];
      return user.finished.indexOf(id) !== -1;
    }
});


Template.EventRanking.events({
  'change input[role="taskCompleted"]': (ev, tpl) => {
    let completed = !!ev.target.checked;
    let taskId = ev.target.getAttribute('data-id');
    let event = tpl.data.event;
    Meteor.call("EventTimings.toggleRanking", event._id, taskId, completed);
  }
});
