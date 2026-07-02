import express from "express";
import { submitContact, getAllContacts } from "../../controllers/contact.controller.js";
import { protect, restrictToAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Protected route to submit contact form (requires login)
router.post("/", protect, submitContact);

// Protected admin route to get all contacts
router.get("/", protect, restrictToAdmin, getAllContacts);

export default router;
