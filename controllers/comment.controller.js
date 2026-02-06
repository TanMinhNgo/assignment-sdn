const Perfume = require('../models/perfume');

const addComment = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const perfumeId = req.params.perfumeId;
    const memberId = req.user._id;

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }

    const existingComment = perfume.comments.find(
      comment => comment.author.toString() === memberId.toString()
    );

    if (existingComment) {
      return res
        .status(400)
        .json({ message: 'You have already commented on this perfume' });
    }

    perfume.comments.push({
      rating,
      content,
      author: memberId,
    });

    await perfume.save();

    const updatedPerfume = await Perfume.findById(perfumeId)
      .populate('brand', 'brandName')
      .populate('comments.author', 'membername email');

    res.status(201).json(updatedPerfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const { perfumeId, commentId } = req.params;
    const memberId = req.user._id;

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }

    const comment = perfume.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== memberId.toString()) {
      return res
        .status(403)
        .json({ message: 'You can only edit your own comments' });
    }

    comment.rating = rating;
    comment.content = content;

    await perfume.save();

    const updatedPerfume = await Perfume.findById(perfumeId)
      .populate('brand', 'brandName')
      .populate('comments.author', 'membername email');

    res.json(updatedPerfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { perfumeId, commentId } = req.params;
    const memberId = req.user._id;

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }

    const comment = perfume.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== memberId.toString()) {
      return res
        .status(403)
        .json({ message: 'You can only delete your own comments' });
    }

    comment.deleteOne();
    await perfume.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
};
