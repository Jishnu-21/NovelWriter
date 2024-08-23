const Chat = require('../models/Chat');

const getChatHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const chatHistory = await Chat.find({ userId }); // Modify this query based on your schema
        if (!chatHistory) {
          return res.status(404).json({ message: 'Chat history not found' });
        }
        res.json(chatHistory);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).send('Internal Server Error');
      }
    };

const sendMessage = async (req, res) => {
  const { userId, text, sender } = req.body;
  const newMessage = new Chat({ userId, text, sender });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
};