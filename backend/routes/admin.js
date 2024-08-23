const express = require('express');
const router = express.Router();
const { getUsers, toggleUserBlock, getGenres, createGenre, updateGenre, toggleGenre,getStories, toggleStoryBlock,getStoryReports } = require('../controller/adminController');

router.get('/users', getUsers);
router.get('/stories', getStories);
router.patch('/users/:id/block', toggleUserBlock);
router.patch('/story/:id/block', toggleStoryBlock);
router.get('/genres', getGenres);
router.post('/genres', createGenre);
router.put('/genres/:id', updateGenre);
router.patch('/genres/:id/toggle', toggleGenre);
router.get('/reports/:storyId', getStoryReports);

module.exports = router;