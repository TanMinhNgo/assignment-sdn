const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const {
  isAdmin,
  isAuthenticated,
  isSelfOrAdmin,
} = require('../middleware/auth');

router.post('/register', memberController.registerMember);

router.get('/me', isAuthenticated, memberController.getCurrentMember);

router.get('/:memberId', isAuthenticated, memberController.getMemberById);
router.put('/:memberId', isSelfOrAdmin, memberController.updateMember);
router.put(
  '/:memberId/password',
  isSelfOrAdmin,
  memberController.changePassword
);

router.get('/', isAdmin, memberController.getAllMembers);

module.exports = router;
