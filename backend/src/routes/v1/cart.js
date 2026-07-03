import express from "express";
import { getCart, addToCart, updateQuantity, removeProduct, clearCart } from "../../controllers/cart.js";
import { protect } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { addToCartSchema, updateQuantitySchema } from "../../validations/cart.js";

const router = express.Router();

// Cart routes require login
router.use(protect);

router.get("/", getCart);
router.post("/", validate(addToCartSchema), addToCart);
router.put("/", validate(updateQuantitySchema), updateQuantity);
router.delete("/:productId", removeProduct);
router.delete("/", clearCart);

export default router;
