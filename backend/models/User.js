const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; }},
  image_url: { type: String },
  isVerified: { type: Boolean, default: false },
  interests: [{ type: String }],
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  resetToken: { type: String }, 
  resetTokenExpires: { type: Date },
  followers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followedAt: { type: Date, default: Date.now },
  }],
  following: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followedAt: { type: Date, default: Date.now },
  }],
});

userSchema.methods.follow = async function(userId) {
  // Check if already following
  if (!this.following.some(follow => follow.userId.toString() === userId.toString())) {
    // Add to following
    this.following.push({ userId, followedAt: new Date() });
    await this.save();

    // Add to the other user's followers
    const userToFollow = await mongoose.model('User').findById(userId);
    if (userToFollow) {
      userToFollow.followers.push({ userId: this._id, followedAt: new Date() });
      await userToFollow.save();
    }
  }
};

userSchema.methods.unfollow = async function(userId) {
  // Remove from following
  this.following = this.following.filter(follow => follow.userId.toString() !== userId.toString());
  await this.save();

  // Remove from the other user's followers
  const userToUnfollow = await mongoose.model('User').findById(userId);
  if (userToUnfollow) {
    userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.userId.toString() !== this._id.toString());
    await userToUnfollow.save();
  }
};

module.exports = mongoose.model('User', userSchema);
