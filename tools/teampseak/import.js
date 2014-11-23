var Ts = require('./teamspeak'),
    _ = require('lodash'),
    Q = require('q');

if (!process.argv[2]) {
    console.error("Provide json with channels structure");
    process.exit(-1);
}

var channels = require("./" + process.argv[2].replace('.json', ''));

Ts.clearChannels().then(function () {
    Ts.importChannelTree(channels).then(function () {
        console.log('Imported');
        //process.exit(0);
    }).fail(function (error) {
        console.error(new Error('Teamspeak - ' + error.msg));
    });
}).fail(function (error) {
    console.error(new Error('Teamspeak - ' + error.msg));
});