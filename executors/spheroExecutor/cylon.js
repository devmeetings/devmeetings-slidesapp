var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' },
  device: {name: 'sphero', driver: 'sphero'},

  work: function(my) {
    every((0.5).second(), function() { 
      my.sphero.roll(120, Math.floor(Math.random() * 360));
    });
  }
}).start();
