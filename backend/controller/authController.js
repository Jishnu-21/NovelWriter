const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const temporaryStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Signup request received:', { username, email, password });

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists in the database (assuming a User model is available)
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP and its expiration time
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes
    const userId = uuidv4();

    // Store user information temporarily
    temporaryStore.set(email, {
      userId,
      username,
      password: await bcrypt.hash(password, 10), // Hash password
      otp,
      otpExpires,
    });

    // Email options for sending OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for signup',
      text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    };

    // Send OTP email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Error sending OTP email' });
      }
      console.log('Email sent:', info.response);
    });

    // Respond with success
    res.status(201).json({ message: 'OTP sent to email', email });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('Verifying OTP:', { email, otp });

    const tempUser = temporaryStore.get(email);
    if (!tempUser) {
      return res.status(404).json({ message: 'OTP not found or expired' });
    }

    if (tempUser.otp !== otp || Date.now() > tempUser.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = new User({
      username: tempUser.username,
      email,
      password: tempUser.password,
      isVerified: true,
    });

    await user.save();

    temporaryStore.delete(email);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received:', { email, password });

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, username: user.username, email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Resend OTP request received:', { email });

    // Check if the temporary user data exists
    const tempUser = temporaryStore.get(email);
    if (!tempUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new OTP and set its expiration time
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 1 * 60 * 1000; // OTP expires in 1 minute

    // Update the temporary user data with the new OTP
    tempUser.otp = otp;
    tempUser.otpExpires = otpExpires;
    temporaryStore.set(email, tempUser);

    // Email options for sending the new OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new OTP for signup',
      text: `Your new OTP is ${otp}. It will expire in 1 minute.`,
    };

    // Send the new OTP via email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending new OTP email:', error);
        return res.status(500).json({ message: 'Error sending OTP email' });
      }
      console.log('New OTP email sent:', info.response);
    });

    res.status(200).json({ message: 'New OTP sent to email' });
  } catch (error) {
    console.error('Error during OTP resend:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const { userId, username, email } = req.body;

    console.log('Received callback data:', { userId, username, email });

    let user = await User.findOne({ googleId: userId });

    
    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked. Please contact support.' });
    }


    if (!user) {
      user = new User({
        googleId: userId,
        username,
        email
      });
      await user.save();
      console.log('New user created:', user);
    } else {
      console.log('Existing user found:', user);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated token:', token);

    res.json({ token, user });
  } catch (err) {
    console.error('Error during Google OAuth callback:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.googleId) {
      return res.status(403).json({ message: 'Password reset is not allowed for Google sign-in users' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset email sent' });
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log('Received reset password request with token:', token);

    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

    if (!user) {
      console.log('Invalid or expired token');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    console.log('Password reset successful');
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await User.findOne({ email, isAdmin: true });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};