const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: false }, // Make this optional
  type: { 
    type: String, 
    enum: ['like', 'review', 'follow', 'unfollow'], 
    required: true 
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
