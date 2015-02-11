/*jshint esnext:true */

Meteor.loginAsXplaUser = function(session, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {xpla: true, session: session};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};

Meteor.startup( () => {
  HTTP.get('/api/session', function(err, sess) {
    if (err || !sess) {
      return;
    }
    Meteor.loginAsXplaUser(sess);
  });
});

