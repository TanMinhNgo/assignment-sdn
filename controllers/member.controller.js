const Member = require('../models/member');
const bcrypt = require('bcrypt');

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId).select(
      '-password'
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerMember = async (req, res) => {
  try {
    const { membername, email, password } = req.body;

    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = new Member({
      membername,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    await member.save();

    res.status(201).json({
      message: 'Registration successful',
      member: {
        id: member._id,
        membername: member.membername,
        email: member.email,
        isAdmin: member.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { membername, email } = req.body;
    const memberId = req.params.memberId;

    const updateData = {};
    if (membername) updateData.membername = membername;
    if (email) updateData.email = email;

    const member = await Member.findByIdAndUpdate(memberId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const memberId = req.params.memberId;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, member.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    member.password = await bcrypt.hash(newPassword, 10);
    await member.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentMember = (req, res) => {
  try {
    const member = {
      id: req.user._id,
      membername: req.user.membername,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    };
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  registerMember,
  updateMember,
  changePassword,
  getCurrentMember,
};
