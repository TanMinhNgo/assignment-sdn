const Member = require('../models/member');
const bcrypt = require('bcrypt');

// GET login page
const getLoginPage = (req, res) => {
  res.render('login', { error: req.query.error });
};

// POST login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await Member.findOne({ email });
    if (!member) {
      return res.redirect('/auth/login?error=Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.redirect('/auth/login?error=Invalid email or password');
    }

    // Manual login using Passport
    req.login(member, err => {
      if (err) {
        return res.redirect('/auth/login?error=Login failed');
      }
      return res.redirect('/auth/profile');
    });
  } catch (error) {
    res.redirect('/auth/login?error=Server error');
  }
};

// GET register page
const getRegisterPage = (req, res) => {
  res.render('register', { error: req.query.error });
};

// POST register
const register = async (req, res) => {
  try {
    const { membername, email, password } = req.body;

    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.redirect('/auth/register?error=Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const member = new Member({
      membername,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    await member.save();

    // Auto login after registration
    req.login(member, err => {
      if (err) {
        return res.redirect('/auth/login');
      }
      return res.redirect('/auth/profile');
    });
  } catch (error) {
    res.redirect('/auth/register?error=Registration failed');
  }
};

// GET profile page
const getProfile = (req, res) => {
  res.render('profile', { user: req.user });
};

// GET logout
const logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};

module.exports = {
  getLoginPage,
  login,
  getRegisterPage,
  register,
  getProfile,
  logout,
};
