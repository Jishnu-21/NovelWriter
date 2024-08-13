const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; }},
  image_url: { type: String },
  isVerified: { type: Boolean, default: false },
  interests:[{type:String}],
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  resetToken: { type: String }, 
  resetTokenExpires: { type: Date } ,
});

module.exports = mongoose.model('User', userSchema);
