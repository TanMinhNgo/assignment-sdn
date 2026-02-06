const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { isAuthenticated } = require('../middleware/auth');

// All comment routes require authentication
// Routes are for perfumes/:perfumeId/comments

router.use(isAuthenticated);
// POST add comment to a perfume
router.post('/:perfumeId/comments', commentController.addComment);

// PUT update own comment
router.put('/:perfumeId/comments/:commentId', commentController.updateComment);

// DELETE own comment
router.delete(
  '/:perfumeId/comments/:commentId',
  commentController.deleteComment
);

module.exports = router;
