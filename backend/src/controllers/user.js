import asyncHandler from "../utils/asyncHandler.js";
import { UserService } from "../services/user.js";
import { ApiResponse } from "../utils/response.js";

const userService = new UserService();

export const registerUser = asyncHandler(async (req, res) => {

    const userData = req.body || {};

    const newUser = await userService.registerUser(userData);

    res.status(201).json(new ApiResponse(201, newUser, "User registered successfully"));
});

export const registerAdmin = asyncHandler(async (req, res) => {
    const newAdmin = await userService.registerAdmin(req.body || {});
    res.status(201).json(new ApiResponse(201, newAdmin, "Admin registered successfully!"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    const { user, token } = await userService.loginUser(email, password);

    res.status(200).json(new ApiResponse(200, { user, token }, "User logged in successfully"));
});

export const googleLogin = asyncHandler(async (req, res) => {
    const { name, email } = req.body || {};

    if (!email || !name) {
        return res.status(400).json(new ApiResponse(400, null, "Name and email are required for Google Login"));
    }

    const { user, token } = await userService.googleLogin(name, email);

    res.status(200).json(new ApiResponse(200, { user, token }, "Google Login successful"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();

    res.status(200).json(new ApiResponse(200, users));
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const deletedUser = await userService.deleteUser(id);

    res.status(200).json(new ApiResponse(200, deletedUser, "User deleted successfully"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await userService.getUserProfile(userId);
    res.status(200).json(new ApiResponse(200, user, "Profile retrieved successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
    const userId = req.user.id; // User ID extracted from the auth token
    const updateData = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json(new ApiResponse(400, null, "Please provide an email address"));
    }

    const { user, resetToken } = await userService.generatePasswordResetToken(email);

    // In a real application, we would send an email here with a link containing the resetToken.
    // For this development version, we will just return it in the response so the frontend can display it or the developer can copy it.
    
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    res.status(200).json(new ApiResponse(200, { resetToken, resetUrl }, "Password reset link generated. Check console/response for link!"));
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
        return res.status(400).json(new ApiResponse(400, null, "Please provide token and new password"));
    }

    const user = await userService.resetPassword(token, newPassword);

    res.status(200).json(new ApiResponse(200, null, "Password has been successfully reset. You can now log in."));
});

export const changePassword = asyncHandler(async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    
    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json(new ApiResponse(400, null, "Please provide email, current password, and new password"));
    }

    // We can reuse login logic to verify current password
    const { user } = await userService.loginUser(email, currentPassword);
    
    // Now update the password
    await userService.updateUser(user._id, { currentPassword, newPassword });

    res.status(200).json(new ApiResponse(200, null, "Password changed successfully. You can now log in."));
});
