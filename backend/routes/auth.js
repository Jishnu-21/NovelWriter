
const express = require('express');
const router = express.Router();
const { signup, verifyOtp, login, resendOtp, googleCallback, forgotPassword, resetPassword, adminLogin } = require('../controller/authController')

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp', resendOtp);
router.post('/callback', googleCallback);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/admin-login', adminLogin);

module.exports = router;