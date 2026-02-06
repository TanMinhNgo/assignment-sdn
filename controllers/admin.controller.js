const Perfume = require('../models/perfume');
const Brand = require('../models/brand');
const Member = require('../models/member');

const getDashboard = async (req, res) => {
  try {
    const perfumeCount = await Perfume.countDocuments();
    const brandCount = await Brand.countDocuments();
    const memberCount = await Member.countDocuments();

    res.render('admin/dashboard', {
      stats: {
        perfumes: perfumeCount,
        brands: brandCount,
        members: memberCount,
      },
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.render('admin/members', {
      members,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getMembers,
};
