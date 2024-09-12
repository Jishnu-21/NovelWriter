const ReadingHistory = require('../models/ReadingHistory');
const Story = require('../models/Story'); // Ensure this line is present

exports.getReadingHistory = async (req, res) => {
    try {
      const history = await ReadingHistory.find({ userId: req.params.userId })
        .populate('bookId', 'title'); // Change 'bookId' to 'storyId' if your reading history uses 'storyId'
      res.json({ history });
    } catch (error) {
      console.error('Error fetching reading history:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

exports.addOrUpdateReadingHistory = async (req, res) => {
  const { bookId, title } = req.body;
  try {
    const existingEntry = await ReadingHistory.findOne({ userId: req.params.userId, bookId });

    if (existingEntry) {
      // Update the existing entry if found
      existingEntry.dateRead = Date.now();
      await existingEntry.save();
      return res.json({ message: 'Reading history updated', entry: existingEntry });
    } else {
      // Create a new entry
      const newEntry = new ReadingHistory({ userId: req.params.userId, bookId, title });
      await newEntry.save();
      return res.status(201).json({ message: 'Reading history added', entry: newEntry });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteSpecificEntry = async (req, res) => {
    const { userId, bookId } = req.params;

    try {
      // Delete the specific reading history entry for the user
      const result = await ReadingHistory.findOneAndDelete({ userId, bookId });
      
      if (!result) {
        return res.status(404).json({ error: 'Reading history entry not found.' });
      }
  
      res.status(200).json({ message: 'Reading history entry deleted successfully.' });
    } catch (error) {
      console.error('Error deleting reading history entry:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };