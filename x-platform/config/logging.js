var winston = require('winston');
var config = require('./config');


var forExpress = new winston.Logger({
  transports: []
});

if (config.graylog) {
  var Graylog2 = require('winston-graylog2');
  forExpress.add(Graylog2, {
    graylogHost: config.graylog.host,
    graylogPort: config.graylog.port
  });
}

winston.forExpress = forExpress;
module.exports = winston;
