/*jshint esnext:true */

Accounts.config({
  forbidClientAccountCreation: true
});

// Deny changing documents using meteor
Meteor.users.deny({
  update: function() {
    return true;
  }
});

Accounts.registerLoginHandler(function(loginRequest) {
  if (!loginRequest.xpla || !loginRequest.session) {
    return;
  }

  var x = Meteor.users.findOne({
    userId: loginRequest.session
  });

  if (!x) {
    return;
  }

  var mongoUserId = x._id;
  var user = Meteor.users.findOne({
    meteorUserId: mongoUserId
  });

  var userId;
  if (!user) {
    user = x;
    // We have user in Mongo (with ObjectId) and we need to create another one:/
    userId = Meteor.users.insert({
      userId: mongoUserId,
      meteorUserId: mongoUserId,
      username: user.name,
      emails: [{
        address: user.email,
        verified: true
      }]
    });
  } else {
    userId = user._id;
  }

  //creating the token and adding to the user
  var stampedToken = Accounts._generateStampedLoginToken();
  //hashing is something added with Meteor 0.7.x, 
  //you don't need to do hashing in previous versions
  var hashStampedToken = Accounts._hashStampedToken(stampedToken);

  Meteor.users.update(userId, {
    $push: {
      'services.resume.loginTokens': hashStampedToken
    }
  });

  //send loggedin user's user id
  return {
    userId: userId,
    token: stampedToken.token
  };
});
