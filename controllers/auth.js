const process = require('node:process');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CustomError = require('../helpers/CustomError');
const {generateVerificationCode, sendVerificationCode, hashCode} = require('../helpers/email');
const User = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;

async function userRegister(data) {
  try {
    const code = generateVerificationCode();
    const hashedCode = hashCode(code);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({
      ...data,
      role: 'user',
      verificationCode: hashedCode,
      verificationCodeExpiry: expiry
    });
    await sendVerificationCode(user.email, code);
    const tokens = user.generateJwt();
    user.refreshTokenHash = tokens.refreshTokenHash;
    await user.save();
    return {message: 'User created successfully', user, tokens: {accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}};
  } catch (error) {
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
async function verifyEmail(code) {
  try {
    if (!code) throw new CustomError({statusCode: 400, message: 'Verification code is required', code: 'EMPTY_CODE'});
    const hashedCode = hashCode(code);
    const user = await User.findOne({
      verificationCode: hashedCode,
      verificationCodeExpiry: {$gt: Date.now()}
    });
    if (!user) throw new CustomError({statusCode: 400, message: 'Invalid or expired code', code: 'INVALID_CODE'});
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();
    return true;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
async function userLogin(data) {
  try {
    const user = await User.findOne({email: data.email}).exec();
    if (!user) {
      throw new CustomError({statusCode: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS'});
    }

    const isValid = user.verifyPassword(data.password);
    if (!isValid) {
      throw new CustomError({statusCode: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS'});
    }
    if (!user.isVerified) {
      throw new CustomError({statusCode: 403, message: 'Please verify your email to login', code: 'EMAIL_NOT_VERIFIED'});
    }

    const tokens = user.generateJwt();
    user.refreshTokenHash = tokens.refreshTokenHash;
    await user.save();

    return {message: 'Login successful', user, tokens: {accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}};
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError({statusCode: 500, message: err.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}

async function userLogout(data) {
  try {
    const {refreshToken, userId} = data;
    if (!refreshToken && !userId) throw new CustomError({statusCode: 400, message: 'refreshToken or userId required', code: 'MISSING_PARAMETERS'});

    let uid = userId;
    if (refreshToken && !uid) {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
      uid = decoded.userId;
    }

    const user = await User.findById(uid).exec();
    if (!user) throw new CustomError({statusCode: 404, message: 'User not found', code: 'USER_NOT_FOUND'});

    user.refreshTokenHash = null;
    await user.save();
    return {message: 'Logged out'};
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') throw new CustomError({statusCode: 401, message: 'Invalid refresh token', code: 'INVALID_TOKEN'});
    if (err instanceof CustomError) throw err;
    throw new CustomError({statusCode: 400, message: err.message, code: 'BAD_REQUEST'});
  }
}

async function refreshTokens(data) {
  try {
    const {refreshToken} = data;
    if (!refreshToken) throw new CustomError({statusCode: 400, message: 'refreshToken is required', code: 'MISSING_PARAMETERS'});

    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(payload.userId).exec();
    if (!user) throw new CustomError({statusCode: 404, message: 'User not found', code: 'USER_NOT_FOUND'});

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash || '');
    if (!matches) throw new CustomError({statusCode: 401, message: 'Refresh token invalid', code: 'INVALID_TOKEN'});

    const tokens = user.generateJwt();
    user.refreshTokenHash = tokens.refreshTokenHash;
    await user.save();

    return {accessToken: tokens.accessToken, refreshToken: tokens.refreshToken};
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') throw new CustomError({statusCode: 401, message: 'Invalid refresh token', code: 'INVALID_TOKEN'});
    if (err instanceof CustomError) throw err;
    throw new CustomError({statusCode: 400, message: err.message, code: 'BAD_REQUEST'});
  }
}

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  verifyEmail,
  refreshTokens
};
