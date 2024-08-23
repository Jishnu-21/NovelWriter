const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const Notification = require('../models/Notification');

exports.addInterest = async (req, res) => {
  const { userId } = req.params;
  const { interests } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { interests },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update interests' });
  }
};

exports.getUser = async (req, res) => {           
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.editUser = async (req, res) => {
  try {
    const { username, image_url } = req.body;
    const userId = req.params.id;

    // Initialize an empty variable for the image URL
    let updatedImageUrl = image_url;

    // Handle image upload if a new image is provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'users' },
          (error, image) => {
            if (error) {
              return reject(error);
            }
            resolve(image);
          }
        ).end(req.file.buffer);
      });

      updatedImageUrl = result.secure_url; // Get the image URL from Cloudinary
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, image_url: updatedImageUrl },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.followUser = async (req, res) => {
  const { userId, targetUserId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.follow(targetUserId);

    const notification = new Notification({
      userId: targetUserId, // The user being followed
      message: `${user.username} started following you.`, // Customize the notification message
      type: 'follow', // You can define the type for easier filtering later
      createdAt: new Date()
    });

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  const { userId, targetUserId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.unfollow(targetUserId);

    const notification = new Notification({
      userId: targetUserId, // The user being unfollowed
      message: `${user.username} unfollowed you.`, // Customize the notification message
      type: 'unfollow', // Define type for easier filtering later
      createdAt: new Date()
    });
    
    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Use the authenticated user's ID
    const notifications = await Notification.find({ userId })
      .populate('storyId', 'name') // Populate the storyId field
      .populate('userId', 'username') // Populate the userId field to get the username
      .sort({ createdAt: -1 });

    const formattedNotifications = notifications.map(notification => {
      return {
        ...notification._doc,
        message: `${notification.message}`, 
      };
    });

    res.status(200).json({ notifications: formattedNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};