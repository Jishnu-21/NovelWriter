const express = require('express');
const { getChatHistory, sendMessage } = require('../controller/chatController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/:userId', getChatHistory);
router.post('/send', upload.single('image'), sendMessage); // Handle image uploads

module.exports = router;
