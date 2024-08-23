const Story = require('../models/Story');
const Genre = require('../models/Genre');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User'); // Add this line
const Notification = require('../models/Notification');

exports.createStory = async (req, res) => {
  try {
    const { description, genre, rating, name, id } = req.body;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'stories' },
        (error, image) => {
          if (error) {
            return reject(error);
          }
          resolve(image);
        }
      ).end(req.file.buffer);
    });

    // Save story to the database
    const story = new Story({
      description,
      genre,
      rating,
      name,
      coverPage: result.secure_url,
      author: id
    });

    const savedStory = await story.save();

    res.status(201).json({ message: 'Story created successfully', story: savedStory });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find({ isActive: true });
    if (genres && Array.isArray(genres)) {
      res.json(genres);
    } else {
      console.error('Backend error: Genres not in expected format');
      res.status(500).json({ message: 'Genres data is not in expected format' });
    }
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Error fetching genres' });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    console.log('Attempting to delete story with ID:', storyId);
    const result = await Story.findByIdAndDelete(storyId);
    console.log('Delete result:', result);
    if (result) {
      res.status(200).json({ message: 'Story deleted successfully', storyId });
    } else {
      res.status(404).json({ message: 'Story not found', storyId });
    }
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    console.log('Attempting to retrieve story with ID:', storyId);

    const story = await Story.findById(storyId)
      .populate('author', 'username')
      .populate({
        path: 'reviews.userId', // Populate userId in reviews
        select: 'username', // Only select the username field
      });

    if (story) {
      res.status(200).json({ 
        message: 'Story found', 
        story 
      });
    } else {
      res.status(404).json({ 
        message: 'Story not found' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};


exports.getUnpublishedStories = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const unpublishedStories = await Story.find({ author: userId, isPublished: false });
    res.json(unpublishedStories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching unpublished stories' });
  }
};


exports.publishStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    // Update the story to set isPublished to true and add a publishing date
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { isPublished: true, publishingDate: new Date() },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json({ message: 'Story published successfully', story: updatedStory });
  } catch (error) {
    console.error('Error publishing story:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getPublished = async (req, res) => {
  try {
    const stories = await Story.find({ isPublished: true });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching published stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getStoryByAuthor = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    if (!authorId) {
      return res.status(400).json({ message: 'Author ID is required' });
    }
    console.log(authorId);

    const stories = await Story.find({ author: authorId });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecommendedStories = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userInterests = user.interests || [];

    const recommendedStories = await Story.find({
      genre: { $in: userInterests },
      isPublished: true,
      author: { $ne: userId } 
    }).limit(2); 

    res.json(recommendedStories);
  } catch (error) {
    console.error('Error fetching recommended stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; 
    console.log(userId);

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if the user is the author of the story
    if (story.author.toString() === userId) {
      return res.status(400).json({ message: 'You cannot review your own story' });
    }

    const newReview = {
      userId,
      rating,
      comment,
      createdAt: new Date()
    };

    story.reviews.push(newReview);
    await story.save();

    // Optionally, create a notification for the story author
    await Notification.create({ 
      userId: story.author, 
      storyId: storyId, 
      type: 'review', 
      message: `${req.user.username} reviewed your story: ${story.name}` 
    });

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.toggleLike = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;
    
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() === userId) {
      return res.status(400).json({ message: 'You cannot like your own story' });
    }

    const likeIndex = story.likes.findIndex(like => like.userId.toString() === userId);
    
    let notificationMessage;
    if (likeIndex > -1) {
      story.likes.splice(likeIndex, 1);
      notificationMessage = `${req.user.username} unliked your story: ${story.name}`;
    } else {
      story.likes.push({ userId });
      notificationMessage = `${req.user.username} liked your story: ${story.name}`;
    }

    await story.save();

    await Notification.create({ 
      userId: story.author, 
      storyId: storyId, 
      type: 'like', 
      message: notificationMessage 
    });

    res.json({ message: likeIndex > -1 ? 'Story unliked' : 'Story liked', likes: story.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.editReview = async (req, res) => {
  try {
    const { storyId, reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    console.log(`Editing review ${reviewId} for story ${storyId} by user ${userId}`); // Added logging

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const review = story.reviews.id(reviewId);
    if (!review || review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Review not found or unauthorized' });
    }

    review.rating = rating;
    review.comment = comment;
    review.updatedAt = new Date();

    await story.save();

    console.log(`Review ${reviewId} updated successfully`); // Added logging
    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Error updating review:', error); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { storyId, reviewId } = req.params; // Extract IDs from request params
    const userId = req.user.id; // Get the user ID from the request

    // Log the IDs to verify they are being received correctly
    console.log(`Deleting review ${reviewId} for story ${storyId} by user ${userId}`);

    // Find the story by ID
    const story = await Story.findById(storyId);
    if (!story) {
      console.log(`Story with ID ${storyId} not found.`);
      return res.status(404).json({ message: 'Story not found' });
    }

    // Find the review by ID
    const reviewIndex = story.reviews.findIndex((review) => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
      console.log(`Review with ID ${reviewId} not found.`);
      return res.status(404).json({ message: 'Review not found' });
    }
    if (story.reviews[reviewIndex].userId.toString() !== userId) {
      console.log(`User ${userId} is not authorized to delete this review.`);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Remove the review and save the story
    story.reviews.splice(reviewIndex, 1);
    await story.save();

    console.log(`Review with ID ${reviewId} deleted successfully.`);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};