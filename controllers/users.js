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

async function getUserProfile(userId) {
    try {
        const user = await User.findById(userId);
        if(!user) throw {status: 404, message: "User not Found"};
        return {user};
    } catch (err) {
        if (err.status) throw err;
        throw { status: 500, message: err.message };
    }
}

async function updateUserProfile(userId, data) {
    try {
        const allowedFields = ['firstName', 'lastName', 'dob'];
        const updates = {};

        for(const field of allowedFields){
            if(data[field] !== undefined){
                updates[field] = data[field];
            }
        }
        
        const user = await User.findByIdAndUpdate(userId, updates, {returnDocument: 'after', runValidators: true});
        if(!user) throw{status: 404, message: "user not Found"};
        
        return { message: "Profile updated successfully", user };
    } catch (err) {
        if (err.status) throw err;
        throw { status: 500, message: err.message };
    }
}

async function updateUserPassword(userId, data) {
    try {
        const {currentPassword, newPassword} = data;
        if(!currentPassword || !newPassword){
            throw{status: 400, message: "Current and New Passwords are required."};
        }

        const user = await User.findById(userId);
        if(!user) throw{status: 404, message: "user not Found"};
        
        const isValid = user.verifyPassword(currentPassword);
        if(!isValid) throw{status: 401, message: "Wrong Password."};
        
        user.password = newPassword;
        await user.save();

        return { message: "Password updated successfully" };
    } catch (err) {
        if (err.status) throw err;
        throw { status: 500, message: err.message };
    }
}

async function getUsersProfiles(query) {
    try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit),
            User.countDocuments()
        ]);

        return {
            users,
            pagination: {
                currentPage: page,
                totalItems: total,
                totalPages: Math.ceil(total/limit)
            }
        };
    } catch (err) {
        if (err.status) throw err;
        throw { status: 500, message: err.message };
    }
}

async function deleteUserProfile(userID) {
    try {
        const user = await User.findByIdAndDelete(userID);
        if(!user) throw{status: 404, message: "user not Found"};
        return { message: "User deleted successfully" };
    } catch (err) {
        if (err.status) throw err;
        throw { status: 500, message: err.message };
    }
}

module.exports = {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    getUsersProfiles,
    deleteUserProfile
};