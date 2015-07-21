// @TODO generate token with require('crypto') and handle user verification
// http://nodejs.org/api/crypto.html

var Mailer = {
  sendEmail: function (app, template, params, callback) {
    app.mailer.send(template, params, callback);
  }
};

module.exports = Mailer;
