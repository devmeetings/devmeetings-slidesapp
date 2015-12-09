var mongoose = require('mongoose');

var UserModel = mongoose.model('user', new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  passwordChangeCode: {
    type: String
  },
  type: {
    type: String,
    enum: ['local', 'g+', 'fb', 'github'],
    default: 'local'
  },
  verified: {
    type: Boolean,
    default: false
  },
  acl: {
    type: [String],
    enum: ['admin:super', 'admin:slides', 'admin:events', 'trainer', 'student'],
    default: 'student'
  },
  added: {
    type: Date,
    default: Date.now
  },
  bio: {
    type: String
  },
  avatar: {
    type: String
  }
}));

var gravatar = require('gravatar');

UserModel.schema.pre('save', function (next) {
  var user = this;
  user.avatar = gravatar.url(user.email);
  next();
});

module.exports = UserModel;
