const express = require('express');
const router = express.Router();
const passport = require('../passport/auth.passport');
const authController = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth');

// Profile page
router.get('/profile', isAuthenticated, authController.getProfile);

// Login routes
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);

// Register routes
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.register);

// Logout
router.get('/logout', authController.logout);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/profile',
    failureRedirect: '/auth/login',
  })
);

module.exports = router;
