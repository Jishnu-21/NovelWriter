const express = require('express');
const router = express.Router();
const { addInterest, getUser, editUser,followUser,unfollowUser, getNotifications } = require('../controller/userController');
const multer = require('multer');
const authenticate = require('../middleware/AuthMiddleware');

const storage = multer.memoryStorage(); 

const upload = multer({ storage });
router.get('/notifications',authenticate, getNotifications);
router.post('/:userId/interests', addInterest);
router.get('/:userId', getUser);
router.get('/notifications',authenticate, getNotifications);
router.put('/:id', upload.single('file'), editUser);
router.post('/:userId/follow/:targetUserId', followUser);
router.post('/:userId/unfollow/:targetUserId', unfollowUser);

module.exports = router;
