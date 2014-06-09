define(['slider/slider.plugins'], function(sliderPlugins) {
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

