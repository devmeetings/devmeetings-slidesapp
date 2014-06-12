define(['slider/slider.plugins', 'services/Sockets'], function(sliderPlugins, Sockets) {
  sliderPlugins.factory('User', ['Sockets', function(Sockets) {
    var userData;
    Sockets.emit('getUserData');
    Sockets.on('userData',function(data){
      userData = data;
    });
    return {
      getUserData: function(){ return userData; }
    };
  }]);
});

