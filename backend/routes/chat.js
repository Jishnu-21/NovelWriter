const express = require('express');
const { getChatHistory, sendMessage } = require('../controller/chatController');

const router = express.Router();

router.get('/:userId', getChatHistory);
router.post('/send', sendMessage);

module.exports = router;
