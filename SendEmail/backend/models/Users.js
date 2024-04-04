const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  otp: { type: Number },
});

module.exports = mongoose.model('Users', userSchema);
