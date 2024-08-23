const User = require('../models/User');
const Genre = require('../models/Genre');
const Story = require('../models/Story');
const Report = require('../models/Report');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: { $ne: true } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createGenre = async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
    description: req.body.description,
    isActive: true
  });

  try {
    const newGenre = await genre.save();
    res.status(201).json(newGenre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    genre.name = req.body.name || genre.name;
    genre.description = req.body.description || genre.description;

    const updatedGenre = await genre.save();
    res.json(updatedGenre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.toggleGenre = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    genre.isActive = !genre.isActive;
    await genre.save();
    res.json(genre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate('author', 'username');
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleStoryBlock = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    story.isBlocked = !story.isBlocked;
    await story.save();
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getStoryReports = async (req, res) => {
  try {
    const { storyId } = req.params;
    const reports = await Report.find({ storyId }).populate('userId', 'username reason');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

