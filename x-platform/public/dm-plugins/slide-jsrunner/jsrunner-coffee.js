define(['_', 'require'], function (_, require) {
  return {
    get: function (invoke) {
      require(['coffee'], function (coffee) {
        invoke(function (code) {
          return coffee.compile(code, {
            bare: true
          });
        });
      });
    }
  };
});
