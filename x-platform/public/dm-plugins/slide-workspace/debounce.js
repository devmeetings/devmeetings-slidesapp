'use strict';

import _ from '_';

function safeApply (scope, fn) {
  var phase = scope.$root.$$phase;
  if (phase === '$apply' || phase === '$digest') {
    if (fn && (typeof (fn) === 'function')) {
      fn();
    }
  } else {
    scope.$apply(fn);
  }
}

export default function (scope, func, timeout) {
  return _.debounce((...args) => {
    safeApply(scope, () => {
      func(...args);
    });
  }, timeout);
}
