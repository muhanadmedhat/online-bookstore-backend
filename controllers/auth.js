const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const process = require('node:process');
const User = require('../models/users');
const CustomError = require("../helpers/CustomError");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;

async function userRegister(data) {
    try {
        const user = await User.create(data);
        const tokens = user.generateJwt();
        user.refreshTokenHash = tokens.refreshTokenHash;
        await user.save();
        return { message: "User created successfully", user, tokens: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken } };
    } catch (error) {
        throw new CustomError({ statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR' });
    }
}

async function userLogin(data) {
    try {
        const user = await User.findOne({ email: data.email }).exec();
        if (!user) {
            throw new CustomError({ statusCode: 401, message: "Invalid email or password", code: 'INVALID_CREDENTIALS' });
        }

        const isValid = user.verifyPassword(data.password);
        if (!isValid) {
            throw new CustomError({ statusCode: 401, message: "Invalid email or password", code: 'INVALID_CREDENTIALS' });
        }

        // check if the email is verified or not

        const tokens = user.generateJwt();
        user.refreshTokenHash = tokens.refreshTokenHash;
        await user.save();

        return { message: "Login successful", user, tokens: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken } };
    } catch (err) {
        if (err instanceof CustomError) throw err;
        throw new CustomError({ statusCode: 500, message: err.message, code: 'INTERNAL_SERVER_ERROR' });
    }
}

async function userLogout(data) {
    try {
        const { refreshToken, userId } = data;
        if (!refreshToken && !userId) throw new CustomError({ statusCode: 400, message: 'refreshToken or userId required', code: 'MISSING_PARAMETERS' });

        let uid = userId;
        if (refreshToken && !uid) {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            uid = decoded.userId;
        }

        const user = await User.findById(uid).exec();
        if (!user) throw new CustomError({ statusCode: 404, message: 'User not found', code: 'USER_NOT_FOUND' });

        user.refreshTokenHash = null;
        await user.save();
        return { message: 'Logged out' };
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') throw new CustomError({ statusCode: 401, message: 'Invalid refresh token', code: 'INVALID_TOKEN' });
        if (err instanceof CustomError) throw err;
        throw new CustomError({ statusCode: 400, message: err.message, code: 'BAD_REQUEST' });
    }
}

/////////////// bug ///////////////
async function refreshTokens(data) {
    try {
        const { refreshToken } = data;
        if (!refreshToken) throw new CustomError({ statusCode: 400, message: 'refreshToken is required', code: 'MISSING_PARAMETERS' });

        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await User.findById(payload.userId).exec();
        if (!user) throw new CustomError({ statusCode: 404, message: 'User not found', code: 'USER_NOT_FOUND' });

        const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash || '');
        if (!matches) throw new CustomError({ statusCode: 401, message: 'Refresh token invalid', code: 'INVALID_TOKEN' });

        // issue new tokens (rotation)
        const tokens = user.generateJwt();
        user.refreshTokenHash = tokens.refreshTokenHash;
        await user.save();

        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') throw new CustomError({ statusCode: 401, message: 'Invalid refresh token', code: 'INVALID_TOKEN' });
        if (err instanceof CustomError) throw err;
        throw new CustomError({ statusCode: 400, message: err.message, code: 'BAD_REQUEST' });
    }
}

async function verifyEmail(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw new CustomError({ statusCode: 409, message: "Username already exists", code: 'DUPLICATE_EMAIL' });
        throw new CustomError({ statusCode: 400, message: err.message, code: 'BAD_REQUEST' });
    }
}

async function resebdVerification(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw new CustomError({ statusCode: 409, message: "Username already exists", code: 'DUPLICATE_EMAIL' });
        throw new CustomError({ statusCode: 400, message: err.message, code: 'BAD_REQUEST' });
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