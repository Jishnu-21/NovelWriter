const Story = require('../models/Story');
const Genre = require('../models/Genre');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User'); // Add this line

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

    const story = await Story.findById(storyId).populate('author', 'username');

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