define([], function() {

    return function(assertion, names, args) {
        // Single assertions does not require writing return...
        if (assertion.indexOf('return') === -1) {
            assertion = 'return ' + assertion + ';';
        }

        var toEval = [
            '(function(' + names.join(',') + '){',
            assertion,
            '}).apply(null, args)'
        ].join(';\n');

        /* jshint evil:true */
        var result = eval(toEval);
        /* jshint evil:false */

        return result;
    };
});