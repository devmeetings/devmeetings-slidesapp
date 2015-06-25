var winston = require('winston');
var config = require('./config');


var forExpress = new winston.Logger({
    transports: [new winston.transports.Console({
      colorize: true
    })]
});

if (config.graylog) {
  var Graylog2 = require('winston-graylog2');

  winston.add(Graylog2, {
      graylogHost: config.graylog.host,
      graylogPort: config.graylog.port
  });

  forExpress.add(Graylog2, {
      graylogHost: config.graylog.host,
      graylogPort: config.graylog.port
  });

}

winston.forExpress = forExpress;
module.exports = winston;
