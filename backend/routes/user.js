const express = require('express');
const router = express.Router();
const { addInterest, getUser, editUser } = require('../controller/userController');
const multer = require('multer');

const storage = multer.memoryStorage(); 

const upload = multer({ storage });
router.post('/:userId/interests', addInterest);
router.get('/:userId', getUser);
router.put('/:id', upload.single('file'), editUser);

module.exports = router;
