const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter your Name'],
    maxLength: [30, 'Name should not exceed 30 characters'],
    minLength: [4, 'Name should be greater than 4 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please Enter your Email'],
    unique: true,
    validate: [validator.isEmail, 'Please Enter valid Email'],
  },
  password: {
    type: String,
    required: [true, 'Please Enter your Password'],
    minLength: [8, 'Password should be greater than 8 characters'],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});
// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//method for Comparing hash Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generating  Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
  //generating Token
  //crypto is built in module. we generate randome string of 20 bytes using crypto
  const resetToken = crypto.randomBytes(20).toString('hex');

  //Hashing and adding to user schema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
