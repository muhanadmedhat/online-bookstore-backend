const User = require('../models/users');
const CustomError = require('../helpers/CustomError');

async function createUserProfile(data) {
    try {
        const user = await User.create(data);
        return { message: "User created successfully", user, jwt };
    } catch (err) {
        if (err.code === 11000) throw new CustomError({ statusCode: 409, message: "Username already exists", code: 'DUPLICATE_EMAIL' });
        throw new CustomError({ statusCode: 400, message: err.message, code: 'BAD_REQUEST' });
    }
}

async function getUserProfile(userId) {
    try {
        const user = await User.findById(userId);
        if(!user) throw new CustomError({ statusCode: 404, message: "User not Found", code: 'USER_NOT_FOUND' });
        return {user};
    } catch (err) {
        if (err instanceof CustomError) throw err;
        throw new CustomError({ statusCode: 500, message: err.message, code: 'INTERNAL_SERVER_ERROR' });
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
        if(!user) throw new CustomError({ statusCode: 404, message: "user not Found", code: 'USER_NOT_FOUND' });
        
        return { message: "Profile updated successfully", user };
    } catch (err) {
        if (err instanceof CustomError) throw err;
        throw new CustomError({ statusCode: 500, message: err.message, code: 'INTERNAL_SERVER_ERROR' });
    }
}

async function updateUserPassword(userId, data) {
    try {
        const {currentPassword, newPassword} = data;
        if(!currentPassword || !newPassword){
            throw new CustomError({ statusCode: 400, message: "Current and New Passwords are required.", code: 'MISSING_PARAMETERS' });
        }

        const user = await User.findById(userId);
        if(!user) throw new CustomError({ statusCode: 404, message: "user not Found", code: 'USER_NOT_FOUND' });
        
        const isValid = user.verifyPassword(currentPassword);
        if(!isValid) throw new CustomError({ statusCode: 401, message: "Wrong Password.", code: 'INVALID_CREDENTIALS' });
        
        user.password = newPassword;
        await user.save();

        return { message: "Password updated successfully" };
    } catch (err) {
        if (err instanceof CustomError) throw err;
        throw new CustomError({ statusCode: 500, message: err.message, code: 'INTERNAL_SERVER_ERROR' });
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
        if (err instanceof CustomError) throw err;
        throw new CustomError({ statusCode: 500, message: err.message, code: 'INTERNAL_SERVER_ERROR' });
    }
}

async function deleteUserProfile(userID) {
    try {
        const user = await User.findByIdAndDelete(userID);
        if(!user) throw new CustomError({ statusCode: 404, message: "user not Found", code: 'USER_NOT_FOUND' });
        return { message: "User deleted successfully" };
    } catch (err) {
        if (err instanceof CustomError) throw err;
        throw new CustomError({ statusCode: 500, message: err.message, code: 'INTERNAL_SERVER_ERROR' });
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