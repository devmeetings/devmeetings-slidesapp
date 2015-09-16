/* globals define */
define([], function () {
  return function (assertion, names, args) {
    // Single assertions does not require writing return...
    if (assertion.indexOf('return') === -1) {
      assertion = 'return ' + assertion + ';';
    }

    var toEval = [
      '(function(' + names.join(',') + '){',
      assertion,
      '}).apply(null, args)'
    ].join(';\n');

    var result = false;
    try {
      /* eslint-disable no-eval */
      result = eval(toEval);
      /* eslint-enable no-eval */
    } catch (e) {
      console.warn('Error when evaluating assertion', e);
      result = false;
    }

    return result;
  };
});
