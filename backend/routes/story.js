const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { createStory, getGenres, getUnpublishedStories,deleteStory,publishStory,getPublished,getStory,getStoryByAuthor,getRecommendedStories} = require('../controller/storyController');

router.post('/stories', upload.single('coverPage'), createStory);
router.get('/genres', getGenres);
router.get('/unpublished', getUnpublishedStories);
router.get('/published', getPublished);
router.delete('/:id',deleteStory);
router.get('/:id',getStory);
router.put('/publish/:id', publishStory);
router.get('/by-author/:authorId', getStoryByAuthor);
router.get('/recommended/:userId', getRecommendedStories);
module.exports = router;