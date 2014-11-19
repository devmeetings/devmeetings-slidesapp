define(['_', 'coffee'], function(_, coffee) {

    return {
        compileToJs: function(code) {
            return coffee.compile(code, {
                bare: true
            });
        }
    };
});
