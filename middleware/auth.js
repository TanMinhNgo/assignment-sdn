const Member = require('../models/member');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Authentication required' });
};

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
};

// Middleware to check if user can only edit their own information
const isSelfOrAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const requestedUserId = req.params.memberId || req.params.id;

  if (req.user.isAdmin || req.user._id.toString() === requestedUserId) {
    return next();
  }

  return res
    .status(403)
    .json({ message: 'You can only edit your own information' });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isSelfOrAdmin,
};
