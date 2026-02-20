const User = require('../models/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const process = require('node:process');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;

async function userRegister(data) {
    try {
        const user = await User.create(data);
        const tokens = user.generateJwt();
        user.refreshTokenHash = tokens.refreshTokenHash;
        await user.save();
        return { message: "User created successfully", user, tokens: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken } };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

async function userLogin(data) {
    try {
        const user = await User.findOne({ email: data.email}).exec();
        if (!user) {
            throw { status: 401, message: "Invalid email or password" };
        }

        const isValid = user.verifyPassword(data.password);
        if (!isValid) {
            throw { status: 401, message: "Invalid email or password" };
        }

        // check if the email is verified or not

        const tokens = user.generateJwt();
        user.refreshTokenHash = tokens.refreshTokenHash;
        await user.save();

        return { message: "Login successful", user, tokens: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken } };
    } catch (err) {
        if (err.status) throw err;
        throw { status: 500, message: err.message };
    }
}

async function userLogout(data) {
    try {
        // logout by invalidating stored refresh token
        const { refreshToken, userId } = data;
        if (!refreshToken && !userId) throw { status: 400, message: 'refreshToken or userId required' };

        let uid = userId;
        if (refreshToken && !uid) {
            // try to decode refresh token to get userId
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            uid = decoded.userId;
        }

        const user = await User.findById(uid).exec();
        if (!user) throw { status: 404, message: 'User not found' };

        user.refreshTokenHash = null;
        await user.save();
        return { message: 'Logged out' };
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') throw { status: 401, message: 'Invalid refresh token' };
        if (err.status) throw err;
        throw { status: 400, message: err.message };
    }
}

async function refreshTokens(data) {
    try {
        const { refreshToken } = data;
        if (!refreshToken) throw { status: 400, message: 'refreshToken is required' };

        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await User.findById(payload.userId).exec();
        if (!user) throw { status: 404, message: 'User not found' };

        const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash || '');
        if (!matches) throw { status: 401, message: 'Refresh token invalid' };

        // issue new tokens (rotation)
        const tokens = user.generateJwt();
        user.refreshTokenHash = tokens.refreshTokenHash;
        await user.save();

        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') throw { status: 401, message: 'Invalid refresh token' };
        if (err.status) throw err;
        throw { status: 400, message: err.message };
    }
}

async function verifyEmail(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

async function resebdVerification(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    verifyEmail,
    resebdVerification,
    refreshTokens
};