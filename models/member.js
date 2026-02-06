const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    membername: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
