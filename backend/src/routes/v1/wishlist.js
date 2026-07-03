import express from "express";
import { getWishlist, addProduct, removeProduct } from "../../controllers/wishlist.js";
import { protect } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { addProductToWishlistSchema } from "../../validations/wishlist.js";

const router = express.Router();

// Apply the protect middleware to ALL wishlist routes 
// because a user MUST be logged in to have a wishlist!
router.use(protect);

// GET /api/v1/wishlist/
router.get("/", getWishlist);

// POST /api/v1/wishlist/
router.post("/", validate(addProductToWishlistSchema), addProduct);

// DELETE /api/v1/wishlist/:productId
router.delete("/:productId", removeProduct);

export default router;
