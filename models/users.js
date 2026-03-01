const process = require('node:process');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const nameRegex = /^[A-Z]+$/i;
const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      minlength: [3, 'First name must be at least 3 characters'],
      maxlength: [30, 'First name must be at most 30 characters'],
      match: [nameRegex, 'First name must contain only letters'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      minlength: [3, 'Last name must be at least 3 characters'],
      maxlength: [30, 'Last name must be at most 30 characters'],
      match: [nameRegex, 'Last name must contain only letters'],
      trim: true
    },
    dob: {
      type: Date,
      validate: {
        validator: (value) => !value || value <= new Date(),
        message: 'Date of birth cannot be in the future'
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    refreshTokenHash: {
      type: String
    },
    verificationCode: {
      type: String
    },
    verificationCodeExpiry: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function () {
  if (!this.isModified('password')) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.set('toJSON', {
  transform: (doc, {__v, refreshTokenHash, password, ...rest}, options) => rest
});

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
  const JWT_SECRET = process.env.JWT_SECRET;
  const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;
  
  const accessToken = jwt.sign({userId: this._id, role: this.role}, JWT_SECRET, {expiresIn: '15m'});
  const refreshToken = jwt.sign({userId: this._id}, REFRESH_SECRET, {expiresIn: '30d'});
  const refreshTokenHash = bcrypt.hashSync(refreshToken, 10);
  return {accessToken, refreshToken, refreshTokenHash};
};

module.exports = mongoose.model('User', userSchema);
