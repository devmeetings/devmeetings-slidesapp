var mailer = require('express-mailer');

module.exports = function (app) {
  mailer.extend(app, {
    from: 'No-reply <no-reply@devmeetings.com>',
    host: 'smtp.gmail.com',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
    auth: {
      // Must specify email and account password
      user: '@gmail.com',
      pass: ''
    }
  });
};
