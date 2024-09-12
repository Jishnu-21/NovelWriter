
const express = require('express');
const { getReadingHistory, addOrUpdateReadingHistory, deleteSpecificEntry, } = require('../controller/readingHistoryController');
const router = express.Router();

// Fetch reading history for a user
router.get('/:userId', getReadingHistory);

// Add or update reading history
router.put('/:userId', addOrUpdateReadingHistory);

router.delete('/:userId/:bookId',deleteSpecificEntry );

module.exports = router;
