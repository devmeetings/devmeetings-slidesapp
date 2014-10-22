var cl = require('./connection');


cl.server.thenSend("channellist").then(function(channels){
    
    return cl.send("channelcreate", {
      channel_name: "Test Channel",
      channel_flag_semi_permanent: 'true',
      cpid: cl.findChannelByName(channels, "Charlie").cid
    });

}).then(function(response) {
  console.log("Channel created", response);
  process.exit();
}).done();
