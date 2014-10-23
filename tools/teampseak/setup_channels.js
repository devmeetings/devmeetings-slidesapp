var cl = require('./connection'),
    _ = require('lodash'),
    Q = require('q');


if (!process.argv[2]) {
    console.error("Provide json with channel structure.");
    process.exit(-1);
}

var map = require("./" + process.argv[2].replace('.json', ''));


cl.server.thenSend("clientlist").then(function(response) {
    console.log("Fetched clients");

    var clients = response;
    return cl.send("channellist").then(function(channels) {
        console.log("Fetched channels");

        var processedUsers = [];
        return Q.all(mapping.map(function(d) {
            var user = d[0];
            var channelName = d[1];

            var channel = cl.findChannelByName(channels, channelName);
            if (!channel) {
                console.error("No channel for pattern: " + channelName);
            }

            console.log("Moving clients");
            return Q.allSettled(cl.findClientsByName(clients, user).map(function(c) {
                if (processedUsers.indexOf(c.clid) !== -1) {
                    console.log("Skipping " + c.client_nickname);
                    return;
                }
                console.log("Trying to move " + c.client_nickname + " to " + channel.channel_name);
                processedUsers.push(c.clid);
                return cl.send("clientmove", {
                    clid: c.clid,
                    cid: channel.cid
                }).then(function() {
                    console.log("Moved " + c.client_nickname + " to " + channel.channel_name);
                }, function() {
                    console.error("Error while moving: " + c.client_nickname + " to " + channel.channel_name);
                });
            }));
        }));
    });
}).done(function() {
    process.exit(0);
}); /**/






/*var cl = require('./connection');


cl.server.thenSend("channellist").then(function(channels){
    
    return cl.send("channelcreate", {
      channel_name: "Test Channel 2",
      channel_flag_semi_permanent: 1,
      cpid: cl.findChannelByName(channels, "Charlie").cid
    }).then(function(response) {
      console.log(response);
      return cl.send("channelcreate", {
        channel_name: "Subchannel Test 2",
        channel_flag_semi_permanent: 1,
        cpid: response.cid
    });
    });

}).then(function(response) {
  console.log("Channel created", response);
  //process.exit();
}).done();
*/