import express from "express";
import { registerUser, loginUser, googleLogin, getAllUsers, deleteUser, registerAdmin, updateUser, getUserProfile, forgotPassword, resetPassword, changePassword } from "../../controllers/user.controller.js";
import { protect, restrictToAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

// User Registration Route
// POST /api/v1/users/register
router.post("/register", registerUser);

// Temporary Admin Registration Route
// POST /api/v1/users/register-admin
router.post("/register-admin", registerAdmin);

// User Login Route
// POST /api/v1/users/login
router.post("/login", loginUser);

// Google Login Route
// POST /api/v1/users/google
router.post("/google", googleLogin);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post("/reset-password", resetPassword);

// Change Password Route (Public)
router.post("/change-password", changePassword);

// Get All Users Route (Protected for logged in users only)
// GET /api/v1/users/
router.get("/", protect, getAllUsers);

// Delete User by ID Route (Protected for Admins only)
// DELETE /api/v1/users/:id
router.delete("/:id", protect, restrictToAdmin, deleteUser);

// Get User Profile (Protected for logged-in users)
// GET /api/v1/users/profile
router.get("/profile", protect, getUserProfile);

// Update User Profile (Protected for logged-in users)
// PUT /api/v1/users/profile
router.put("/profile", protect, updateUser);

export default router;
