import jwt from "jsonwebtoken";
import AppError from "../utils/apperror.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.js";

// Middleware to protect routes (require login)
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if the token is in the headers (Format: "Bearer <token>")
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in! Please log in to get access.", 401));
    }

    try {
        // 2. Verify the token using the secret key
        const jwtSecret = process.env.JWT_SECRET || "fallback_super_secret_key";
        const decoded = jwt.verify(token, jwtSecret);

        // 3. Check if the user still exists in the database
        // (Just in case the user was deleted but their token is still active)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError("The user belonging to this token no longer exists.", 401));
        }

        // 4. Attach the user object to the request
        req.user = currentUser;
        
        // 5. Move to the next middleware or controller
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token. Please log in again.", 401));
    }
});

// Middleware to restrict routes to Admins only
export const restrictToAdmin = (req, res, next) => {
    // This MUST be used AFTER the `protect` middleware so req.user exists
    if (!req.user || req.user.isAdmin !== true) {
        return next(new AppError("You do not have permission to perform this action.", 403));
    }
    
    // User is an admin, let them through
    next();
};
