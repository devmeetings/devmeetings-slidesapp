var _ = require('lodash'),
    program = require('commander'),
    Q = require('q'),
    CamtasiaParser = require('./app/camtasia-parser'),
    SnapshotsParser = require('../../platform/app/services/snapshots-parser'),
    MongoBridge = require('../../platform/app/services/raw-mongo-bridge'),
    chapters;

var config = require('../../platform/config/config');

program
    .option('-f, --file [type]', 'XML File')
    .option('-t, --timeoffset [type]', 'Time offset')
    .option('-s, --startTime [startTime]', 'Recording start time')
    .option('-e, --endTime [endTime]', 'Recording end time')
    .parse(process.argv);

if (program.file) {
    console.log("Using Camtasia chapters provider.");
    chapters = CamtasiaParser.parseChapters(program.file);
} else {
    chapters = false;
}

var startTime = new Date(program.startTime || 0);
var endTime = new Date(program.endTime || startTime.getTime() ? startTime.getTime() + 1000 * 3600 * 24 : Date.now());
console.log("Searching items between", startTime, endTime);


var timeoffset = program.timeoffset ? parseInt(program.timeoffset) : 0;
var db = config.db;
var mongoBridge;

MongoBridge(db).then(function(bridge) {
    mongoBridge = bridge;
    return Q.all([chapters, mongoBridge.getSnapshots(startTime.getTime(), endTime.getTime())]);
}).then(function(results) {
    return SnapshotsParser.prepareRecordings(results[0], results[1], timeoffset);
}).then(function(recordings) {
    //return mongoBridge.saveRecordings(recordings);
    return true;
}).done(function() {
    console.log('success!');
    process.exit();
});