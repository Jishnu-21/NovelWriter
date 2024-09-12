const Chat = require('../models/Chat');
const cloudinary = require('../config/cloudinary');
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1860197",
  key: "818ffa62d3c676b1072b",
  secret: "2d737320102eadab04a7",
  cluster: "ap2",
  useTLS: true
});


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
  try {
    const { userId, text, sender } = req.body;
    console.log("Received message data:", { userId, text, sender });

    // Check if required fields are provided
    if (!userId || !sender) {
      return res.status(400).json({ error: 'userId and sender are required.' });
    }

    let imageUrl = null; // Initialize imageUrl

    // Check if an image is provided
    if (req.file) {
      // Check if the image buffer is empty
      if (req.file.size > 0) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'chat_images' },
            (error, image) => {
              if (error) {
                return reject(error);
              }
              resolve(image);
            }
          ).end(req.file.buffer); // Send the buffer to Cloudinary
        });
        
        imageUrl = result.secure_url; // Get the secure URL from Cloudinary
      } else {
        console.log('Received empty image file.');
      }
    }
    
    // Create a new message
    const newMessage = new Chat({ userId, text, sender, image: imageUrl });
    const savedMessage = await newMessage.save(); // Save the message to the database

    pusher.trigger(`user-${userId}`, 'new-message', {
      text,
      sender,
      image: imageUrl, // Use the correct variable here
    });

    res.status(201).json(savedMessage); // Respond with the saved message
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
};





module.exports = {
  getChatHistory,
  sendMessage,
};