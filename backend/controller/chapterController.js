const Chapter = require('../models/Chapter');
const Story = require('../models/Story');
const mongoose = require('mongoose');

// Get all chapters for a specific story
exports.getChaptersByStoryId = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const chapters = await Chapter.find({ storyId });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new chapter for a specific story
exports.createChapter = async (req, res) => {
  try {
    const { title, storyId } = req.body;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const chapter = new Chapter({
      title,
      storyId,
      pages: [],
    });

    const savedChapter = await chapter.save();
    res.status(201).json(savedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a chapter by its ID
exports.deleteChapter = async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found.' });
    }

    await Chapter.findByIdAndDelete(chapterId);
    res.status(200).json({ message: 'Chapter deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ message: 'Failed to delete chapter. Please try again.' });
  }
};

// Get all pages for a specific chapter
exports.getChapterPages = async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found.' });
    }
    res.json(chapter.pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific chapter by its ID
exports.getChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title, pages } = req.body;

    if (!chapterId || !title || !pages || !Array.isArray(pages)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const updatedPages = pages.map(page => ({
      content: page.content,
      choices: page.choices.map(choice => ({
        text: choice.text,
        nextPageIndex: choice.nextPageIndex || null,
      })),
      pageIndex: page.pageIndex,
      isEnd: page.isEnd || false 
    }));

    const updatedChapter = {
      title,
      pages: updatedPages
    };

    const chapter = await Chapter.findByIdAndUpdate(chapterId, updatedChapter, { new: true });
    
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
