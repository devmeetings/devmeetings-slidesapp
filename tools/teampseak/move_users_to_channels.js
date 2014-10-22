var cl = require('./connection'),
    _ = require('lodash'),
    Q = require('q');

function convertToRegexp(map) {
    return _.map(map, function(channel, user) {
        return [new RegExp(user, 'i'), new RegExp(channel, 'i')];
    });
}


if (!process.argv[2]) {
    console.error("Provide json with mapping.");
    process.exit(-1);
}

var map = require("./" + process.argv[2].replace('.json', ''));
var mapping = convertToRegexp(map);

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