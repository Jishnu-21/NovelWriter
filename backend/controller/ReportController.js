const Report = require('../models/Report');
const Story = require('../models/Story');

const reportStory = async (req, res) => {
  const { reason } = req.body;
  const { storyId } = req.params;
  const userId = req.user._id; // Assuming you're using middleware to populate req.user

  try {
    // Create a new report
    const report = new Report({
      storyId,
      userId,
      reason,
    });

    await report.save();
    
    // Optionally, you could add logic to notify the author or admin about the report
    res.status(201).json({ message: 'Report submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error reporting story.', error: error.message });
  }
};

module.exports = {
  reportStory,
};
