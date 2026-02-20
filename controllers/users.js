const User = require('../models/users');

async function createUserProfile(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

async function getUserProfile(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

async function updateUserProfile(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

async function updateUserPassword(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

async function getUsersProfiles(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

async function deleteUserProfile(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw { status: 409, message: "Username already exists" };
        throw { status: 400, message: err.message };
    }
}

module.export = {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    getUsersProfiles,
    deleteUserProfile
};