const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const {
  isAdmin,
  isAuthenticated,
  isSelfOrAdmin,
} = require('../middleware/auth');

// Public route - register
router.post('/register', memberController.registerMember);

// Protected route - get current user profile
router.get('/me', isAuthenticated, memberController.getCurrentMember);

// Protected routes - member can only edit their own information
router.get('/:memberId', isAuthenticated, memberController.getMemberById);
router.put('/:memberId', isSelfOrAdmin, memberController.updateMember);
router.put(
  '/:memberId/password',
  isSelfOrAdmin,
  memberController.changePassword
);

// Admin only - collectors endpoint (get all members)
router.get('/', isAdmin, memberController.getAllMembers);

module.exports = router;
