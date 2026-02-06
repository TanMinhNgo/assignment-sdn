const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/:perfumeId/comments', commentController.addComment);

router.put('/:perfumeId/comments/:commentId', commentController.updateComment);

router.delete(
  '/:perfumeId/comments/:commentId',
  commentController.deleteComment
);

module.exports = router;
