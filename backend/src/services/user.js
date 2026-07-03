import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userRepository } from '../repositories/user.js';
import AppError from '../utils/apperror.js';

const userRepo = new userRepository();

export class UserService {
    async registerUser(userData) {
        const { name, email, password } = userData || {};

        const missing = [];
        if (!name) missing.push("name");
        if (!email) missing.push("email");
        if (!password) missing.push("password");

        if (missing.length > 0) {
            const msg = missing.length === 1
                ? `${missing[0]} not provided`
                : `${missing.slice(0, -1).join(", ")} and ${missing[missing.length - 1]} not provided`;
            throw new AppError(msg, 400);
        }



        const existingUser = await userRepo.getUser(email);
        if (existingUser) {
            throw new AppError("User with this email already exists", 400);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userRepo.createUser({
            name,
            email,
            password: hashedPassword
        });

        return newUser;
    }

    async registerAdmin(userData) {
        const { name, email, password } = userData || {};

        const missing = [];
        if (!name) missing.push("name");
        if (!email) missing.push("email");
        if (!password) missing.push("password");

        if (missing.length > 0) {
            const msg = missing.length === 1
                ? `${missing[0]} not provided`
                : `${missing.slice(0, -1).join(", ")} and ${missing[missing.length - 1]} not provided`;
            throw new AppError(msg, 400);
        }



        const existingUser = await userRepo.getUser(email);
        if (existingUser) {
            throw new AppError("User with this email already exists", 400);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await userRepo.createUser({
            name,
            email,
            password: hashedPassword,
            isAdmin: true
        });
        return newAdmin;
    }

    async loginUser(email, password) {
        const missing = [];
        if (!email) missing.push("email");
        if (!password) missing.push("password");

        if (missing.length > 0) {
            const msg = missing.length === 1 ? `${missing[0]} not provided` : `${missing.join(" and ")} not provided`;
            throw new AppError(msg, 400);
        }

        const user = await userRepo.getUser(email);
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new AppError("Invalid email or password", 401);
        }


        const jwtSecret = process.env.JWT_SECRET || "fallback_super_secret_key";
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            jwtSecret,
            { expiresIn: "7d" }
        );

        user.password = undefined;

        return { user, token };
    }

    async googleLogin(name, email) {
        if (!name || !email) {
            throw new AppError("Name and email are required", 400);
        }

        let user = await userRepo.getUser(email);

        if (!user) {
            // Create a new user with a random dummy password
            const dummyPassword = crypto.randomBytes(16).toString('hex');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(dummyPassword, salt);

            user = await userRepo.createUser({
                name,
                email,
                password: hashedPassword
            });
        }

        const jwtSecret = process.env.JWT_SECRET || "fallback_super_secret_key";
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            jwtSecret,
            { expiresIn: "7d" }
        );

        user.password = undefined;
        return { user, token };
    }

    async getAllUsers() {
        const users = await userRepo.getallUsers();
        // Remove passwords from all users for security
        users.forEach(user => user.password = undefined);
        return users;
    }

    async deleteUser(id) {
        const deletedUser = await userRepo.deleteUser(id);
        if (!deletedUser) {
            throw new AppError("User not found", 404);
        }
        return deletedUser;
    }

    async getUserProfile(id) {
        const user = await userRepo.getUserById(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        user.password = undefined;
        return user;
    }

    async updateUser(id, updateData) {
        if (updateData.email) {
            const existingUser = await userRepo.getUser(updateData.email);
            if (existingUser && existingUser._id.toString() !== id.toString()) {
                throw new AppError("Email is already in use by another account", 400);
            }
        }

        // Handle secure password change
        if (updateData.newPassword) {
            if (!updateData.currentPassword) {
                throw new AppError("Current password is required to set a new password", 400);
            }
            const user = await userRepo.getUserById(id);
            if (!user) {
                throw new AppError("User not found", 404);
            }

            const isPasswordMatch = await bcrypt.compare(updateData.currentPassword, user.password);
            if (!isPasswordMatch) {
                throw new AppError("Incorrect current password", 401);
            }

            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.newPassword, salt);
            delete updateData.newPassword;
            delete updateData.currentPassword;
        }

        const updatedUser = await userRepo.updateUser(id, updateData);
        if (!updatedUser) {
            throw new AppError("User not found", 404);
        }

        updatedUser.password = undefined;
        return updatedUser;
    }

    async generatePasswordResetToken(email) {
        if (!email) {
            throw new AppError("Email is required", 400);
        }

        const user = await userRepo.getUser(email);
        if (!user) {
            throw new AppError("There is no user with that email address", 404);
        }

        // Generate random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash it and set to resetPasswordToken field
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token expire time (1 hour from now)
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

        await user.save();

        return { user, resetToken };
    }

    async resetPassword(token, newPassword) {
        if (!token || !newPassword) {
            throw new AppError("Token and new password are required", 400);
        }

        // Hash the input token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Try to find the user with this valid token
        const user = await userRepo.model.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new AppError("Token is invalid or has expired", 400);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        user.password = undefined;
        return user;
    }
}
