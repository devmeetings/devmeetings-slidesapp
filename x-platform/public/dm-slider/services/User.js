define(['slider/slider.plugins'], function (sliderPlugins) {
  sliderPlugins.factory('User', ['Sockets', '$rootScope', '$q',
    function (Sockets, $rootScope, $q) {
      var userData;
      var result;

      return {
        getUserData: function (callback) {  // deprecated
          if (!userData) {
            Sockets.emit('getUserData');
            Sockets.on('userData', function (data) {
              userData = data;
              $rootScope.$apply(function () {
                callback(data);
              });
            });
          } else {
            callback(userData);
          }
        },
        currentUser: function () {
          if (result) {
            return result.promise;
          }
          result = $q.defer();

          Sockets.emit('getUserData');
          Sockets.on('userData', function (data) {
            userData = data;
            result.resolve(userData);
          });

          return result.promise;
        }
      };
    }
  ]);
});
