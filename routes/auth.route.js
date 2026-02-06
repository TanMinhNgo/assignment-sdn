const express = require('express');
const router = express.Router();
const passport = require('../passport/auth.passport');
const authController = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth');

router.get('/profile', isAuthenticated, authController.getProfile);

router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);

router.get('/register', authController.getRegisterPage);
router.post('/register', authController.register);

router.get('/logout', authController.logout);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  })
);

module.exports = router;
