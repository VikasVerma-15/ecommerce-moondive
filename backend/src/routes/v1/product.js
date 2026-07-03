import express from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../../controllers/product.js";
import { protect, restrictToAdmin } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createProductSchema, updateProductSchema } from "../../validations/product.js";
import { upload } from "../../config/cloudinary.js";

const router = express.Router();

// Middleware to map Multer's req.files array into req.body.images
// This allows Joi to validate the images array correctly before it hits the controller.
const mapFilesToBody = (req, res, next) => {
    if (req.files && req.files.length > 0) {
        // multer-storage-cloudinary automatically uploads the file and puts the URL in `file.path`
        req.body.images = req.files.map(file => file.path);
    }
    next();
};

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected Admin Routes
// We accept up to 5 images using upload.array('images', 5)
router.post("/", protect, restrictToAdmin, upload.array("images", 5), mapFilesToBody, validate(createProductSchema), createProduct);
router.put("/:id", protect, restrictToAdmin, upload.array("images", 5), mapFilesToBody, validate(updateProductSchema), updateProduct);
router.delete("/:id", protect, restrictToAdmin, deleteProduct);

export default router;
