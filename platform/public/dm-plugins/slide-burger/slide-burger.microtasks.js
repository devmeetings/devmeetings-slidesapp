define(['_', 'utils/Plugins', './slide-burger.mapping'], function(_, Plugins, mapping) {
  'use strict';

  function mapToBase(ingridient) {
    return _.find(Object.keys(mapping), function(base) {
      return mapping[base].indexOf(ingridient) !== -1;
    });
  }

  Plugins.registerPlugin('microtask.runner', 'burgerOutput', function(taskData, registerPlugin, listenPlugin, markTaskCompleted) {

    var task = taskData.task;
    /* jshint evil:true */
    var burger = eval(task.burgerOutput);
    /* jshint evil:false */
    burger = burger.map(mapToBase);

    listenPlugin('slide.jsonOutput.display', _.debounce(function(obj) {
      if (task.completed) {
        return;
      }

      obj = obj.map(mapToBase);

      if (_.isEqual(burger, obj)) {
        markTaskCompleted();
      }

    }), 250);
  });

});
