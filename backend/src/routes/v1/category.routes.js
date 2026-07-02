import express from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../../controllers/category.controller.js";
import { protect, restrictToAdmin } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../../validations/category.validation.js";
import { upload } from "../../config/cloudinary.js";

const router = express.Router();

// Middleware to map Multer's req.file into req.body.image for Joi validation
const mapFileToBody = (req, res, next) => {
    if (req.file) {
        req.body.image = req.file.path;
    }
    next();
};

// Public Routes (Anyone can see categories)
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Protected Routes (Only Admins can create, update, or delete categories)
router.post("/", protect, restrictToAdmin, upload.single("image"), mapFileToBody, validate(createCategorySchema), createCategory);
router.put("/:id", protect, restrictToAdmin, upload.single("image"), mapFileToBody, validate(updateCategorySchema), updateCategory);
router.delete("/:id", protect, restrictToAdmin, deleteCategory);

export default router;
