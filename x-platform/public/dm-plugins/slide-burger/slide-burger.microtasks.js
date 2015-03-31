define(['_', 'utils/Plugins', '../slide-microtasks/evalAssertion', './slide-burger.mapping'], function(_, Plugins, evalAssertion, mapping) {
  'use strict';

  function mapToBase(ingridient) {
    return _.find(Object.keys(mapping), function(base) {
      return mapping[base].indexOf(ingridient) !== -1;
    });
  }

  function fixIngridients(a) {
    if (_.isArray(a)) {
      return a.map(mapToBase);
    }
    return mapToBase(a);
  }

  Plugins.registerPlugin('microtask.runner', 'burgerOutput', function(taskData, registerPlugin, listenPlugin, markTaskCompleted) {

    var task = taskData.task;

    listenPlugin('slide.jsonOutput.display', _.debounce(function(obj) {
      if (task.completed) {
        return;
      }
      var assertion = task.burgerOutput;


      obj = obj.map(mapToBase);

      var result = evalAssertion(assertion, ['x', 'equals'], [obj, function(a, b) {
          return _.isEqual(fixIngridients(a), fixIngridients(b));
      }]);

      if (result) {
        markTaskCompleted();
      }

    }), 250);
  });

});
