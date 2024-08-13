const express = require('express');
const router = express.Router();
const chapterController = require('../controller/chapterController');

router.get('/:storyId', chapterController.getChaptersByStoryId);
router.post('/', chapterController.createChapter);
router.get('/:chapterId', chapterController.getChapter);
router.put('/:chapterId', chapterController.updateChapter);
router.delete('/:chapterId', chapterController.deleteChapter);

module.exports = router;
