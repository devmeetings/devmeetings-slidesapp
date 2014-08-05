var _ = require('lodash'),
    program = require('commander'),
    Q = require('q'),
    CamtasiaParser = require('./app/camtasia-parser'),
    SnapshotsParser = require('./app/snapshots-parser'),
    MongoBridge = require('./app/mongo-bridge');

var config = require('../../platform/config/config');

program
    .option('-f, --file [type]', 'XML File')
    .option('-t, --timeoffset [type]', 'Time offset')
    .parse(process.argv);

if (!program.file) {
    console.log('You must provide both params');
    process.exit();
}


var timeoffset = program.timeoffset ? parseInt(program.timeoffset) : 0;
var db = config.db; 
var mongoBridge;

MongoBridge(db).then(function (bridge) {
    mongoBridge = bridge;
    return Q.all([CamtasiaParser.parseFile(program.file), mongoBridge.getSnapshots()]);
}).then(function (results) {
    return SnapshotsParser.prepareRecordings(results[0], results[1], timeoffset);
}).then(function (recordings) {
    return mongoBridge.saveRecordings(recordings); 
}).done(function () {
    console.log('success!');
    process.exit(); 
});




