var events = require('events');

/*
var Ts = require('../services/teamspeak');

Ts.getList().then(function (channelsTree) {
 console.log(channelsTree);
 }).fail(function (error) {
 console.error(new Error('Teamspeak - ' + error.msg));
 });

 Ts.createChannel({channel_name: 'Test4 channel', cpid: 138654, channel_flag_permanent: 1}).then(function (result) {
 console.log(result);
 }).fail(function (error) {
 console.error(new Error('Teamspeak - ' + error.msg));
 });

 Ts.removeChannel(138661).then(function (result) {
 console.log(result);
 }).fail(function (error) {
 console.error(new Error('Teamspeak - ' + error.msg));
 });

 Ts.moveClients([92], 139177).then(function () {
 console.log('Moved');
 }).fail(function (error) {
 console.error(new Error('Teamspeak - ' + error.msg));
 });
 */

module.exports = new events.EventEmitter();
